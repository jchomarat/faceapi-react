class ApiCalls {
    
    constructor() {
        this.faceAPIBaseUrl = process.env.REACT_APP_BASE_FACEAPI_URL;
        this.faceAPISecret = process.env.REACT_APP_BASE_FACEAPI_SECRET;
        
        // instantiate endpoints
        this._personGroupsEndPoint = "/persongroups";
        this._personsEndPoint = "/persons";
        this._personPictureEndPoint = "/persistedFaces";
        this._train = "/train";
        this._trainingCheck = "/training";
        this._faceDetect = "/detect";
        this._faceIdentify = "/identify";
    }

    personGroupsEndPoint(personGroupId) {
        if (typeof(personGroupId) === 'undefined') {
            return (`${this.faceAPIBaseUrl}${this._personGroupsEndPoint}`);
        }
        else {
            return (`${this.faceAPIBaseUrl}${this._personGroupsEndPoint}/${personGroupId}`);
        }
    }

    personsEndPoint(personGroupId, personId) {
        if (typeof(personId) === 'undefined') {
            return (`${this.faceAPIBaseUrl}${this._personGroupsEndPoint}/${personGroupId}${this._personsEndPoint}`);
        }
        else {
            return (`${this.faceAPIBaseUrl}${this._personGroupsEndPoint}/${personGroupId}${this._personsEndPoint}/${personId}`);
        }
    }

    personPictureEndPoint(personGroupId, personId) {
        return (`${this.faceAPIBaseUrl}${this._personGroupsEndPoint}/${personGroupId}${this._personsEndPoint}/${personId}${this._personPictureEndPoint}`);
    }

    personGroupTrainEndPoint(personGroupId) {
        return (`${this.faceAPIBaseUrl}${this._personGroupsEndPoint}/${personGroupId}${this._train}`);
    }

    personGroupTrainingCheckEndPoint(personGroupId) {
        return (`${this.faceAPIBaseUrl}${this._personGroupsEndPoint}/${personGroupId}${this._trainingCheck}`);
    }

    faceDetectEndPoint() {
        return (`${this.faceAPIBaseUrl}${this._faceDetect}`);
    }

    faceIdentifyEndPoint() {
        return (`${this.faceAPIBaseUrl}${this._faceIdentify}`);
    }

    getCommonHeaders() {
        return  {
            'Ocp-Apim-Subscription-Key': this.faceAPISecret,
        };
    }

    async Get(url) {
        return fetch(url, {
            headers: {
                'Ocp-Apim-Subscription-Key': this.faceAPISecret,
            }
        });
    }

    async Delete(url) {
        return fetch(url, {
            method: "DELETE",
            headers: {
                'Ocp-Apim-Subscription-Key': this.faceAPISecret,
            }
        });
    }

    async Post(url, jsonBody) {
        return fetch(url,
        {
            method: "POST",
            body: JSON.stringify(jsonBody),
            headers: {
                'Ocp-Apim-Subscription-Key': this.faceAPISecret,
                'Content-Type': 'application/json',
            }
        })
    }

    async Patch(url, jsonBody) {
        return fetch(url,
        {
            method: "PATCH",
            body: JSON.stringify(jsonBody),
            headers: {
                'Ocp-Apim-Subscription-Key': this.faceAPISecret,
                'Content-Type': 'application/json',
            }
        })
    }

    async PostImage(url, img) {
        return fetch(url,
        {
            method: "POST",
            body: img,
            headers: {
                'Ocp-Apim-Subscription-Key': this.faceAPISecret,
                'Content-Type': 'application/octet-stream',
            }
        })
    }

    async Put(url, jsonBody) {
        return fetch(url,
        {
            method: "PUT",
            body: JSON.stringify(jsonBody),
            headers: {
                'Ocp-Apim-Subscription-Key': this.faceAPISecret,
                'Content-Type': 'application/json',
            }
        })
    }
}

export default ApiCalls;