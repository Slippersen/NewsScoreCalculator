import { useState } from "react";
import { AxiosError } from "axios";
import styled from "styled-components";

import { NewsRequest, NewsResponse } from "../types";
import Api from "../api";

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

const NewsForm = () => {
  const [bodyTemperature, setBodyTemperature] = useState<string>("");
  const [heartRate, setHeartRate] = useState<string>("");
  const [respiratoryRate, setRespiratoryRate] = useState<string>("");
  const [newsScore, setNewsScore] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleCalculate = async () => {
    const request: NewsRequest = {
      TEMP: parseInt(bodyTemperature),
      HR: parseInt(heartRate),
      RR: parseInt(respiratoryRate),
    };
    Api.GetNewsCalculation(request)
      .then((response: NewsResponse) => setNewsScore(response.score))
      .catch((error: AxiosError) => {
        setErrorMessage(error.message);
        console.error(error);
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
      {newsScore !== null && <Result>News score: {newsScore}</Result>}
      {errorMessage !== null && <Result>Error: {errorMessage}</Result>}
    </Container>
  );
};

export default NewsForm;
