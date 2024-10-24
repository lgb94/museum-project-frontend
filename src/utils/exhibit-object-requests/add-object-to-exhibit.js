import axios from "axios";

const museumApi = axios.create({
    baseURL: "https://museum-project-back-end.onrender.com/api"
})

// postObject must look like: {object_id : number, exhibit_id : number }

export const addObjectToExhibit = (postObject) => {
    return museumApi
    .post(`/exhibitobjects`, postObject)
    .then((res) => {
        return res.data;
    })
};
