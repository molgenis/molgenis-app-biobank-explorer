<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>BBMRI-ERIC Directory</title>
  <!-- work around for bug in app store, not loading resources -->
  <script src="https://use.fontawesome.com/4b6985a594.js"></script>
  <link rel="icon" href="/apps/${app.id}/img/favicon.ico" type="image/x-icon"/>
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta/css/bootstrap.min.css" integrity="sha384-/Y6pD6FV/Vv2HJnA6t+vslU6fwYXjCFtcEpHbNJ0lyAFsXTsjBbfaDjzALeQsN6M" crossorigin="anonymous" />
</head>
<body>
<div id="app"></div>
<script>
  window.__INITIAL_STATE__ = {
    baseUrl: '/menu/main/apps/${app.id}/',
    serverUrl: 'http://localhost:8080/',
    lng: 'en',
    fallbackLng: 'en'
  }
  // See https://webpack.github.io/docs/configuration.html
  __webpack_public_path__ = '/apps/${app.id}/'
</script>
<!-- built files will be auto injected -->
</body>
</html>
