import React, {useEffect, useState} from 'react';
import HotelCosts from "./HotelCosts";
import axios from "axios";
import {API_BASE_URL} from "../../../config";
import {useParams} from "react-router-dom";




const HotelCostsAndEarnings = (props) => {
    const [costs, setCosts] = useState({});
    const [earnings, setEarnings] = useState({});
    const [flag, setFlag] = useState(false);
    const params = useParams()

    const fetchData = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/chart_data/${params.id}`);
            setEarnings(response.data.monthly_earnings)
            setCosts(response.data.monthly_costs)
            console.log(response.data.monthly_earnings)
            setFlag(true)

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {

        if (!flag) {
            fetchData();
        }

    }, [costs, costs.length, earnings, earnings.length, fetchData]);

    return (
        <div>
            <HotelCosts title={"Przychody"} data={earnings} hotelId={params.id} data_type={"earnings"}/>
            <HotelCosts title={"Koszty"} data={costs} hotelId={params.id} data_type={"costs"}/>
        </div>
    );
}

export default HotelCostsAndEarnings;