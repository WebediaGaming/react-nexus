<% if(vars.lang) { %><!doctype html lang='<%- vars.lang %>'><% } else { %><!doctype html><% } %>
<html>
<head>
  <% if(vars.charset) { %><meta charset='<%- vars.charset %>'><% } else { %><meta charset='utf-8'><% } %>
  <meta http-equiv='X-UA-Compatible' content='IE=edge'>
  <% if(vars.description) { %><meta name='description' content='<%- vars.description %>'><% } %>
  <% if(vars.viewport) { %><meta name='viewport' content='<%- vars.viewport %>'><% } else { %><meta name='viewport' content='width=device-width, initial-scale=1'><% } %>
  <% if(vars.title) { %><title><%- vars.title %></title><% } %>
  <% if(vars.stylesheets) { %>
  <% libs._.each(vars.stylesheets, function(href) { %>
  <link rel='stylesheet' type='text/css' href='<%- href %>'>
  <% }); %>
  <% } %>
  <% if(vars.primers) { %>
    <% libs._.each(vars.primers, function(primer) { %>
      <script type='text/javascript'><%= primer %></script>
    <% }); %>
  <% } %>
</head>
<body>
  <div id='__ReactNexusRoot'>
    <%= vars.rootHtml %>
  </div>
  <script type='text/javascript'>
    window.__ReactNexus = {};
    window.__ReactNexus.serializedFlux = '<%= vars.serializedFlux %>';
    window.__ReactNexus.serializedHeaders = '<%= vars.serializedHeaders %>';
    window.__ReactNexus.guid = '<%= vars.guid %>';
    window.__ReactNexus.rootElement = document.getElementById('__ReactNexusRoot');
  </script>
  <% if(vars.scripts) { %>
  <% libs._.each(vars.scripts, function(script) { %>
    <script type='text/javascript' src='<%- script %>'></script>
    <% }); %>
    <% } %>
  </body>
</html>
