/*
 * Copyright 2007 Yu-Jie Lin
 * 
 * This program is free software; you can redistribute it and/or modify it
 * under the terms of the GNU General Public License as published by the Free
 * Software Foundation; either version 3 of the License, or (at your option)
 * any later version.
 * 
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 * FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for
 * more details.
 * 
 * You should have received a copy of the GNU General Public License along
 * with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
/*
On this day for Blogger
Author: Yu-Jie Lin
Creation Date: 2007/08/05 05:27 UTC+8
*/

var OTD_JS_NAME = "onthisday.js";

var OTDblogID = "4075414619052280424";
var OTDtargetID = "feed";
var OTDlimitPosts = 5;
var OTDlimitYears = 5;
var OTDtimezone = "-08:00";
var OTDexcludeThisYear = false;

var OTD_LOADING = "Loading...";
var OTD_ERROR = "Something went wrong!";
var OTD_NO_POST = "No post on this day!";

var OTDcount = 0;
var OTDqueryYear = 0;
var OTDsecondsOffset = 0;

function OTDLoad() {
    // Get parameters
    $("script").each(function() {
        // Is "onthisday.js" in attribute src?
        var srcURI = $(this).attr("src");
        if (srcURI != undefined)
            if (srcURI.indexOf(OTD_JS_NAME) != -1) {
                // Found it! Now parse it.
                var kv = ParseQueryString(decodeURI(srcURI));
                for (key in kv) {
                    switch (key) {
                    case "blogID":
                        OTDblogID = kv[key];
                        break;
                    case "targetID":
                        OTDtargetID = kv[key];
                        break;
                    case "limitPosts":
                        OTDlimitPosts = kv[key];
                        break;
                    case "limitYears":
                        OTDlimitYears = kv[key];
                        break;
                    case "timezone":
                        OTDtimezone = kv[key];
                        break;
                    case "excludeThisYear":
                        OTDexcludeThisYear = Boolean(kv[key]);
                        break;
                    case "loadingMsg":
                        OTD_LOADING = kv[key];
                        break;
                    case "errorMsg":
                        OTD_ERROR = kv[key];
                        break;
                    case "noPostMsg":
                        OTD_NO_POST = kv[key];
                        break;
                        }
                    }
                // Processing timezone
                OTDsecondsOffset += Number(OTDtimezone.substring(1, 3)) * 3600 * 1000;
                OTDsecondsOffset += Number(OTDtimezone.substring(4, 6)) * 60 * 1000;
                if (OTDtimezone.charAt(0) == '+')
                    OTDsecondsOffset *= -1;
                // Load OTD list
                OTDList();
                }
        });
    }

function ParseQueryString(qs) {
    qs = qs.replace(/^[^\?]*?\?/, "");
    var qsPairs = qs.split('&');
    var result = new Array();
    for (i in qsPairs) {
        var pair = new String(qsPairs[i]);
        var kv = pair.split('=');
        result[unescape(kv[0])] = unescape(kv[1]);
        }
    return result;
    }

function OTDGetDateString(year, month, dayOfMonth, hours, minutes, seconds) {
    var date = Date.UTC(year, month, dayOfMonth, hours, minutes, seconds);
    date += OTDsecondsOffset;
    date = new Date(date);
    year = date.getUTCFullYear().toString();
    month = ((date.getUTCMonth()<10)?'0':'') + date.getUTCMonth().toString();
    dayOfMonth  = ((date.getUTCDate()<10)?'0':'') +  date.getUTCDate().toString();
    hours = ((date.getUTCHours()<10)?'0':'') + date.getUTCHours().toString();
    minutes  = ((date.getUTCMinutes()<10)?'0':'') +  date.getUTCMinutes().toString();
    seconds  = ((date.getUTCSeconds()<10)?'0':'') +  date.getUTCSeconds().toString();
    return year + '-' + month + '-' + dayOfMonth + 'T' + hours + ':' + minutes + ':' + seconds;
    }

function OTDGetQueryURI(year) {
    var today = new Date();
    // The date tag is UTC
    var queryURI = "http:\/\/www.blogger.com\/feeds\/" + OTDblogID + 
                   "\/posts\/default?published-min=" + OTDGetDateString(year, today.getMonth() + 1, today.getDate(), 0, 0, 0) + '&' +
                                    "published-max=" + OTDGetDateString(year, today.getMonth() + 1, today.getDate(), 23, 59, 59);

    return queryURI;
    }

function OTDList() {
    $('<div class="loading">' + OTD_LOADING + '<\/div>').appendTo($("div#" + OTDtargetID));
    // Prepare for querying
    var today = new Date();
    OTDqueryYear = today.getFullYear();
    // Exclude this year?
    if (OTDexcludeThisYear) OTDqueryYear--;
    
    var queryURI = OTDGetQueryURI(OTDqueryYear);
    var feed = new google.feeds.Feed(queryURI);
    feed.load(OTDFeedProcess);
    }

function OTDFeedProcess(result) {
    if (!result.error) {
        // Any post available?
        if (result.feed.entries.length > 0) {
            $('<ul id="' + OTDtargetID + '-list" class="otd-list"></ul>').appendTo($("div#" + OTDtargetID));
            for (var entryID=0; entryID<result.feed.entries.length; entryID++) {
                var entry = result.feed.entries[entryID];
                $('<li>' + (new Date(entry.publishedDate)).getFullYear() + 
                  ': <a href="' + entry.link + '">' + entry.title + '<\/a><\/li>').appendTo($("ul#" + OTDtargetID + "-list"));
                OTDcount++;
                // Reach the limit?
                if (OTDcount >= OTDlimitPosts) break;
                }
            }
        // If not reach then query previous year
        var today = new Date();
        if (OTDcount < OTDlimitPosts) {
            OTDqueryYear--;
            if (today.getFullYear() - OTDqueryYear < OTDlimitYears) {
                var queryURI = OTDGetQueryURI(OTDqueryYear);
                var feed = new google.feeds.Feed(queryURI);
                feed.load(OTDFeedProcess);
                return;
                }
            }
        $("div#" + OTDtargetID + " div.loading").remove();
        // Have any post matched?
        if (OTDcount >= OTDlimitPosts || today.getFullYear() - OTDqueryYear >= OTDlimitYears)
            if ($("ul#" + OTDtargetID + "-list").length == 0){
                // No posts
                $('<div class="no-post">' + OTD_NO_POST + '<\/div>').appendTo($("div#" + OTDtargetID));
                }
        }
    else {
        $("div#" + OTDtargetID + " div.loading").remove();
        $('<div class="error">' + OTD_ERROR + '<\/div>').appendTo($("div#" + OTDtargetID));
        }
    }

//
$(document).ready(function() {
  OTDLoad();
  });

// Load Google AJAX Feed API version 1
google.load("feeds", "1");
