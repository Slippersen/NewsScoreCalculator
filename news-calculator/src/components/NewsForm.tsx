import { BaseSyntheticEvent, useEffect, useState } from "react";
import { AxiosError } from "axios";
import styled from "styled-components";

import Api from "../api";

import {
  Measurement,
  NewsErrorData,
  NewsRequest,
  NewsResponse,
} from "../types";

const Container = styled.form`
  /* Content */

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin: 0 auto;
  padding: 0px;
  gap: 40px;

  width: 404px;
  height: 641px;
`;

const Title = styled.h1`
  /* Header */

  width: 221px;
  height: 26px;

  /* Header 2 (20pt) */
  font-style: normal;
  font-weight: 600;
  font-size: 20px;
  line-height: 130%;
  /* identical to box height, or 26px */

  color: #000000;
`;

const FormField = styled.div`
  /* Input field */

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px;
  gap: 12px;

  width: 404px;
  height: 99px;
`;

const Label = styled.label`
  /* Label */

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px;
  gap: 8px;

  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 130%;

  width: 339px;
  height: 46px;

  span {
    width: 339px;
    height: 17px;

    /* Small (14) */
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 17px;
    /* identical to box height */
  }
`;

const Input = styled.input`
  /* Primary Input */

  box-sizing: border-box;

  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 10px 12px 10px 24px;

  width: 404px;
  height: 41px;

  color: #24102B;
  background: #FAF6FF;
  border: 1px solid rgba(116, 36, 218, 0.05);

  
`;

const ButtonGroup = styled.div`
  /* Buttons */

  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0px;
  gap: 24px;

  width: 340px;
  height: 40px;

  button {
    /* Button */
    
    /* Standard brødtekst */
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    /* identical to box height, or 150% */

    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 8px 16px;

    border-radius: 40px;
    border-width: 0px;
  }

  button:hover {
    cursor: pointer;
  }
`;

const CalculateButton = styled.button`
  gap: 10px;

  width: 201px;
  height: 40px;

  background: #7424DA;
  color: #FFFFFF;
`;

const ResetButton = styled.button`
  gap: 12px;

  width: 115px;
  height: 40px;

  background: #FAF6FF;
`;

const Result = styled.div<{ $isError?: boolean }>`
  /* Score */

  box-sizing: border-box;

  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 16px;
  gap: 16px;

  width: 404px;
  height: 58px;

  color: ${(props) => (props.$isError ? "orange" : "#351B44")};

  background: ${(props) => (props.$isError ? "#5a00b3" : "#FAF6FF")};
  border: 1px solid rgba(116, 36, 218, 0.4);
  border-radius: 10px;
`;

// TODO: validate the form, disable button

const NewsForm = () => {
  const [bodyTemperature, setBodyTemperature] = useState<string>("");
  const [heartRate, setHeartRate] = useState<string>("");
  const [respiratoryRate, setRespiratoryRate] = useState<string>("");
  const [newsScore, setNewsScore] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Reset scores and error message when any of the input fields change
  useEffect(() => {
    setNewsScore(null);
    setErrorMessage(null);
  }, [bodyTemperature, heartRate, respiratoryRate]);

  const handleCalculate = async (e: BaseSyntheticEvent) => {
    e.preventDefault();

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
        setErrorMessage(error.response?.data?.detail ?? "An error occurred");
      });
  };

  const handleReset = () => {
    setBodyTemperature("");
    setHeartRate("");
    setRespiratoryRate("");
    setNewsScore(null);
    setErrorMessage(null);
  };

  return (
    <Container onSubmit={handleCalculate}>
      <Title>NEWS score calculator</Title>
      <FormField>
        <Label>
          Body temperature
          <span>Degrees celsius</span>
        </Label>
        <Input
          type="number"
          onChange={(e) => setBodyTemperature(e.target.value)}
        />
      </FormField>
      <FormField>
        <Label>
          Heart rate
          <span>Beats per minute</span>
        </Label>
        <Input
          type="number"
          onChange={(e) => setHeartRate(e.target.value)}
        />
      </FormField>
      <FormField>
        <Label>
          Respiratory rate
          <span>Breaths per minute</span>
        </Label>
        <Input
          type="number"
          onChange={(e) => setRespiratoryRate(e.target.value)}
        />
      </FormField>
      <ButtonGroup>
        <CalculateButton onClick={handleCalculate} type="submit">Calculate NEWS score</CalculateButton>
        <ResetButton onClick={handleReset}>Reset form</ResetButton>
      </ButtonGroup>
      {newsScore && <Result>News score: {newsScore}</Result>}
      {errorMessage && <Result $isError={true}>{errorMessage}</Result>}
    </Container>
  );
};

export default NewsForm;
