const path = require('path');
const Express = require('express');

var server = Express();

// const PATH_DIST = path.resolve(__dirname, '../dist');
// const PATH_STYLES = PATH_DIST + '/styles';

// server.use('/styles', Express.static(PATH_STYLES));
// server.use(Express.static(PATH_DIST));

// var app = require('../app/server');

import React from 'react'
// we'll use this to render our app to an html string
import { renderToString } from 'react-dom/server'
// and these to match the url to routes and then render
import { match, RouterContext } from 'react-router'
import routes from '../app/routes'

// ...

// send all requests to index.html so browserHistory works

server.get('*', (req, res) => {
  // match the routes to the url
    console.log(req.url );
    match({ routes: routes, location: req.url }, (err, redirect, props) => {
      // in here we can make some decisions all at once
      if (err) {
        // there was an error somewhere during route matching
        res.status(500).send(err.message)
      } else if (redirect) {
        // we haven't talked about `onEnter` hooks on routes, but before a
        // route is entered, it can redirect. Here we handle on the server.
        res.redirect(redirect.pathname + redirect.search)
      } else if (props) {
        // if we got props then we matched a route and can render
        const appHtml = renderToString(<RouterContext {...props}/>)
        res.send(renderPage(appHtml))
      } else {
        // no errors, no redirect, we just didn't match anything
        res.status(404).send('Not Found')
      }
    })

})

function renderPage(appHtml) {
  return `
    <!doctype html public="storage">
    <html>
    <meta charset=utf-8/>
    <title>My First React Router App</title>
    <div id=app>${appHtml}</div>`
}


var port = process.env.PORT || 8080;
server.listen(port, () => {
  // var port = server.address().port;
  console.log('Server is listening at %s', port);
});