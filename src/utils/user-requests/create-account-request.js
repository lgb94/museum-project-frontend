import axios from "axios";

const museumApi = axios.create({
    baseURL: "https://museum-project-back-end.onrender.com/api"
})

export const createAccount = (userInfo) => {
    return museumApi
    .post(`/users`, userInfo)
    .then ((res) => {
        return res.data
    });
};