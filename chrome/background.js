'use strict';

chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.set({ color: '#3aa757' }, function() {
        console.log("The color is green.");
    });

    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
        chrome.declarativeContent.onPageChanged.addRules([{
            conditions: [
                new chrome.declarativeContent.PageStateMatcher({
                    pageUrl: { hostEquals: 'a.cms.omniupdate.com' }
                }),
                new chrome.declarativeContent.PageStateMatcher({
                    css: ["a#nav-help[href*=oucampus10]", "a.brand[href*='/10/']"] // check for a link to the support site and a link to v10 ou campus
                })
            ],
            actions: [new chrome.declarativeContent.ShowPageAction()]
        }]);
    });
});