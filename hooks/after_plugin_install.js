module.exports = function(context) {
	var fs = require('fs');
	var path = require("path");
	
	var platformRoot = path.join(context.opts.projectRoot, 'platforms/android');
	var manifestFile = path.join(platformRoot, 'app/src/main/AndroidManifest.xml');
	var configFile = path.join(context.opts.projectRoot, 'config.xml');

	var marketId = 0;
	if (fs.existsSync(configFile)) {
		fs.readFile(configFile, 'utf8', function (err, data) {
			if (err) {
				throw new Error('Unable to find config.xml: ' + err);
			}
			if(data.indexOf('name="MARKET" value="cafebazaar"') > 0) {
				console.log("Selected market is Bazaar.");
				marketId = 0;
			} else if(data.indexOf('name="MARKET" value="myket"') > 0) {
				console.log("Selected market is Myket.");
				marketId = 1;
			}
		});
	}
	if (fs.existsSync(manifestFile)) {
		fs.readFile(manifestFile, 'utf8', function (err, data) {
			if (err) {
				throw new Error('Unable to find AndroidManifest.xml: ' + err);
			}
			if(marketId == 1) {
				data = data.replace("<application", '\r\n\t<uses-permission android:name="ir.mservices.market.BILLING" />\r\n\t<queries>\r\n\t\t<package android:name="ir.mservices.market" />\r\n\t\t<intent>\r\n\t\t\t<action android:name="ir.mservices.market.InAppBillingService.BIND" />\r\n\t\t\t<data android:mimeType="*/*" />\r\n\t\t</intent>\r\n\t</queries>\r\n\r\n\t<application');
				var result = data.replace("</application>", '\r\n\t\t<receiver android:name="vinoos.cordova.iap.util.IABReceiver" android:exported="false">\r\n\t\t\t<intent-filter>\r\n\t\t\t\t<action android:name="ir.mservices.market.ping"/>\r\n\t\t\t\t<action android:name="ir.mservices.market.purchase"/>\r\n\t\t\t\t<action android:name="ir.mservices.market.billingSupport"/>\r\n\t\t\t\t<action android:name="ir.mservices.market.consume"/>\r\n\t\t\t\t<action android:name="ir.mservices.market.getPurchase"/>\r\n\t\t\t</intent-filter>\r\n\t\t</receiver>\r\n\t</application>');
				fs.writeFile(manifestFile, result, 'utf8', function (err) {
					if (err) throw new Error('Unable to write AndroidManifest.xml: ' + err);
				});
				console.log("Added Myket to AndroidManifest.");
			} else {
				data = data.replace("<application", '\r\n\t<uses-permission android:name="com.farsitel.bazaar.permission.PAY_THROUGH_BAZAAR" />\r\n\t<queries>\r\n\t\t<package android:name="com.farsitel.bazaar" />\r\n\t\t<intent>\r\n\t\t\t<action android:name="ir.cafebazaar.pardakht.InAppBillingService.BIND" />\r\n\t\t\t<data android:mimeType="*/*" />\r\n\t\t</intent>\r\n\t</queries>\r\n\r\n\t<application');
				var result = data.replace("</application>", '\r\n\t\t<receiver android:name="vinoos.cordova.iap.util.IABReceiver" android:exported="false">\r\n\t\t\t<intent-filter>\r\n\t\t\t\t<action android:name="com.farsitel.bazaar.ping"/>\r\n\t\t\t\t<action android:name="com.farsitel.bazaar.purchase"/>\r\n\t\t\t\t<action android:name="com.farsitel.bazaar.billingSupport"/>\r\n\t\t\t\t<action android:name="com.farsitel.bazaar.consume"/>\r\n\t\t\t\t<action android:name="com.farsitel.bazaar.getPurchase"/>\r\n\t\t\t</intent-filter>\r\n\t\t</receiver>\r\n\t</application>');
				fs.writeFile(manifestFile, result, 'utf8', function (err) {
					if (err) throw new Error('Unable to write AndroidManifest.xml: ' + err);
				});
				console.log("Added Bazaar to AndroidManifest.");
			}
		});
	}
};