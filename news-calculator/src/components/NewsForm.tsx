import { useState } from "react";
import { AxiosError } from "axios";
import styled from "styled-components";

import Api from "../api";

import { Measurement, NewsErrorData, NewsRequest, NewsResponse } from "../types";

const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
  font-family: Arial, sans-serif;
`;

const Title = styled.h1`
  font-size: 2em;
  margin-bottom: 20px;
`;

const FormField = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  font-size: 1em;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const Button = styled.button`
  padding: 10px 20px;
  font-size: 1em;
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin: 0 10px;

  &:hover {
    background-color: #0056b3;
  }
`;

const Result = styled.div`
  margin-top: 20px;
  font-size: 1.5em;
  font-weight: bold;
`;

// TODO: style the form
// TODO: validate the form, disable button, useEffect

const NewsForm = () => {
  const [bodyTemperature, setBodyTemperature] = useState<string>("");
  const [heartRate, setHeartRate] = useState<string>("");
  const [respiratoryRate, setRespiratoryRate] = useState<string>("");
  const [newsScore, setNewsScore] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleCalculate = async () => {
    const temp: Measurement = {
      type: "TEMP",
      value: parseInt(bodyTemperature),
    };

    const hr: Measurement = {
      type: "HR",
      value: parseInt(heartRate),
    };

    const rr: Measurement = {
      type: "RR",
      value: parseInt(respiratoryRate),
    };

    const request: NewsRequest = {
      measurements: [temp, hr, rr],
    };

    Api.GetNewsCalculation(request)
      .then((response: NewsResponse) => setNewsScore(response.score))
      .catch((error: AxiosError<NewsErrorData>) => {
        console.error(error);
        setErrorMessage(error.response?.data?.detail!);
      });
  };

  const handleReset = () => {
    setBodyTemperature("");
    setHeartRate("");
    setRespiratoryRate("");
    setNewsScore(null);
  };

  return (
    <Container>
      <Title>NEWS score calculator</Title>
      <FormField>
        <Label>
          Body temperature
          <span> (Degrees Celsius)</span>
        </Label>
        <Input
          type="number"
          value={bodyTemperature}
          onChange={(e) => setBodyTemperature(e.target.value)}
        />
      </FormField>
      <FormField>
        <Label>
          Heart rate
          <span> (Beats per minute)</span>
        </Label>
        <Input
          type="number"
          value={heartRate}
          onChange={(e) => setHeartRate(e.target.value)}
        />
      </FormField>
      <FormField>
        <Label>
          Respiratory rate
          <span> (Breaths per minute)</span>
        </Label>
        <Input
          type="number"
          value={respiratoryRate}
          onChange={(e) => setRespiratoryRate(e.target.value)}
        />
      </FormField>
      <Button onClick={handleCalculate}>Calculate NEWS score</Button>
      <Button onClick={handleReset}>Reset form</Button>
      {newsScore && <Result>News score: {newsScore}</Result>}
      {errorMessage && <Result>Error: {errorMessage}</Result>}
    </Container>
  );
};

export default NewsForm;
