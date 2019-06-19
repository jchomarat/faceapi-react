import ApiCalls from "../helpers/ApiCalls";

class IdentificationHelper {

    async Detect(file) 
    {
        let api = new ApiCalls();
        let response = await api.PostImage(api.faceDetectEndPoint(), file);
        let data = await response.json();

        return data;
    }

    async Identify(personGroupId, facesDetected) 
    {
        let input = {};
        input.personGroupId = personGroupId;
        input.faceIds = [];
        facesDetected.map((f) => {
            return input.faceIds.push(f.faceId);
        });

        let api = new ApiCalls();
        let response = await api.Post(api.faceIdentifyEndPoint(), input)
        let data = await response.json();

        return data;
    }

    async Authentify(personGroupId, personId, confidence)
    {
        let api = new ApiCalls();
        let response = await api.Get(api.personsEndPoint(personGroupId, personId))
        let data = await response.json();

        return {
            personId: personId,
            name: data.name,
            confidence: confidence
        };
    }

}

export default IdentificationHelper;