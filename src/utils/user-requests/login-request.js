import axios from "axios";

const museumApi = axios.create({
    baseURL: "https://museum-project-back-end.onrender.com/api"
})

export const verifyUser = (userInfo) => {
    return museumApi
    .post(`/users/login`, userInfo)
    .then ((res) => {
        return res.data
    });
};