# Overview

This is a small project to show case the use of Azure Cognitive service Face for face detection.

With this sample, you can
* Create "groups" of persons
* Add person(s) in a group, along with a few photos of these persons
* Train the group before being able to detect faces
* Send a picture, and the AI will tell you if candidate(s) on the picture are "known" persons, i.e. part of the group - with the confidence level.

And for the fun, I made it with [Reactjs](https://reactjs.org/), using [Bootstrap react](https://react-bootstrap.github.io) (also a *premiere* for me).

I am using the following librairies, that I have found, and that were time saver:
* [react-fetchino](https://www.npmjs.com/package/react-fetchino): allow to execute the JavaScript *fetch* command inside a component, dealing with the async loading time. Very powerfull!
* [react-overlay-loader](https://www.npmjs.com/package/react-overlay-loader): a component that will actually display a highly customizable loader - even allowing to show full screen.

# Installation

You can clone the repo, using the command

```sh
git clone https://github.com/jchomarat/faceapi-react
```

Then, install dependencies using the command

```sh
npm install 
```

Navigate to [Azure portal](http://portal.azure.com), log in and add a Face service. Once the service is provisionned, write down the *endpoint* URL on the welcome page of the service, then navigate to the blade *Keys* and write down one of the key property

Rename the "*.env.sample*" file into "*.env*" - and add 
1. The endpoint URL you retrieved previously
2. The key you also wrote down before

```js
REACT_APP_BASE_FACEAPI_URL={ENDPOINT}
REACT_APP_BASE_FACEAPI_SECRET={KEY}
```

You can now start the server, in HTTPS, using the command

```sh
HTTPS=true npm start 
```

Open a browser, and navigate to [localhost:3000](https://localhost:3000)

# Misc

This is a sample project, provided under the **MIT licence**. It is not using the entire Face service capabilities. Please consult the [documentation](https://docs.microsoft.com/en-us/azure/cognitive-services/face/) to see everything these APIs can do.

And finally, feel free to clone it and change it as you see fit.