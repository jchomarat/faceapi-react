# Overview

This is a small project to show case the use of Azure Cognitive service Face for face detection.

With this sample, you can
* Create "group" of persons
* In each group, you can add person(s), along with a few photos of these persons
* You can then train the group, prior to the recognition part
* Finally, you can send a picture, and the AI will tell you if person(s) on the picture are "known" persons, i.e. part of the group - with the confidence level.

And for the fun, I made it with [Reactjs](https://reactjs.org/), using [Bootstrap react](https://react-bootstrap.github.io) for the components (also a *premiere* for me)

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

This is a sample project, provided under the MIT licence. Feel free to clone it and change it as you see fit.