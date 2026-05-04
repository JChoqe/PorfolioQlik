
define([
	'js/qlik',
	'app'
], function (qlik, app) {

	app.controller('HomeCtrl', ['$scope', '$rootScope', '$compile', function ($scope, $rootScope, $compile) {
		$rootScope.addThemePages();
		$rootScope.LOADERPAGE = $compile(`<div class="mz-block">
		<div id="logo-block"></div>
		<div class="flex-loader-cover">
			<div class="status-notification">
				<div class="message-box">
					<div class="loading-animation">
						<div class="bubble"></div>
						<div class="pulse"></div>
					</div>                
				</div>
			</div>
			<p>{{'views.label.esperar' | translate}}</p>
			<div class="texto-loader" ng-bind-html="textoLoader" ng-controller="loaderPageCtrl"></div>
		</div>
	</div>`)($scope);

	}]);

});