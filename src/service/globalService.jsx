import axios from "axios";
export const getLocation = async () => {
    const response = await axios.get(
        "https://provinces.open-api.vn/api/?depth=3"
    );
    return response;
};
