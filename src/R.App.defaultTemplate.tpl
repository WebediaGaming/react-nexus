<!doctype html lang="<%- lang %>">
<html>
    <head>
        <meta charset='utf-8'>
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="description" content="<%- description %>">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <% styleChunks.forEach(function(chunk, name) { %>
            <style type="text/css" data-stylesheet="<%- name %>">
                <%= chunk %>
            </style>
        <% }); %>
    </head>
    <body>
        <div id="ReactOnRails-App-Root">
            <%= rootHtml %>
        </div>
        <script type="text/javascript">
            window.__ReactOnRails = {};
            window.__ReactOnRails.serializedFlux = JSON.parse(<%= JSON.stringify(serializedFlux) %>);
        </script>
        <script type="text/javascript" src="<%- client %>"></script>
    </body>
</html>
