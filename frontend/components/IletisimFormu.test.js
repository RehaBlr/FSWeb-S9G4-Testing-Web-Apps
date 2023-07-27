import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";
import IletisimFormu from "./IletisimFormu";

import App from "./../App";
import { experiments } from "webpack";

const correctFormData = {
  name: "İlhan",
  surname: "Mansız",
  email: "ilhan@gmail.com",
  message: "merhaba ben ilhan",
};
const inCorrectFormData = {
  name: "İl",
  surname: "",
  email: "ilhangmail.com",
  message: "merhaba ben ilhan",
};

test("hata olmadan render ediliyor", () => {
  render(<App />);
  const headerH1 = screen.getByRole("heading", { level: 1 });
  expect(headerH1).toBeInTheDocument();

  const formBasligi = screen.getByText(/İletişim Formu/i);
  expect(formBasligi).toBeInTheDocument();
});

test("iletişim formu headerı render ediliyor", () => {
  render(<IletisimFormu />);
  const headerH1 = screen.getByRole("heading", { level: 1 });
  expect(headerH1).toBeInTheDocument();
});

test("formdaki bütün inputlar render oluyor mu ?", () => {
  render(<IletisimFormu />);
  const adInput = screen.getByLabelText("Ad*");
  const soyadInput = screen.getByPlaceholderText(/mansız/i);
  const emailInput = screen.getByLabelText(/email/i);
  const mesajInput = screen.getByLabelText(/mesaj/i);

  expect(adInput).toBeInTheDocument();
  expect(soyadInput).toBeInTheDocument();
  expect(emailInput).toBeInTheDocument();
  expect(mesajInput).toBeInTheDocument();
});

test("kullanıcı adını 5 karakterden az girdiğinde BİR hata mesajı render ediyor.", async () => {
  render(<IletisimFormu />);
  const adInput = screen.getByLabelText("Ad*");
  adInput.focus();
  userEvent.type(adInput, inCorrectFormData.name);
  const adHataMesaji = await screen.findByText(
    /ad en az 5 karakter olmalıdır/i
  );
  expect(adHataMesaji).toBeInTheDocument();

  const errorsArray = await screen.findAllByTestId("error");
  expect(errorsArray).toHaveLength(1);

  //   const err =screen.getAllByTestId("error",{})
  // userEvent.type(adInput, "abc");
});

test("kullanıcı inputları doldurmadığında ÜÇ hata mesajı render ediliyor.", async () => {
  render(<IletisimFormu />);
  const gonderButton = screen.getByRole("button", { name: /gönder/i });
  userEvent.click(gonderButton);

  const errorsArray = await screen.queryAllByTestId("error");
  expect(errorsArray).toHaveLength(3);

  // await waitFor(() => {
  // const err = screen.queryAllByTestId("error");
  // expect(err).toHaveLength(3);
  // });
  //   const adInput = screen.getByPlaceholderText("İlhan");
});

test("kullanıcı doğru ad ve soyad girdiğinde ama email girmediğinde BİR hata mesajı render ediliyor.", async () => {
  render(<IletisimFormu />);
  const nameInput = screen.getByLabelText("Ad*");
  userEvent.type(nameInput, correctFormData.name);

  const surname = screen.getByLabelText("Soyad*");
  userEvent.type(surname, correctFormData.surname);
  userEvent.click(screen.getByText("Gönder"));

  await waitFor(() => {
    expect(screen.queryAllByTestId("error").length).toBe(1);
  });
});

test('geçersiz bir mail girildiğinde "email geçerli bir email adresi olmalıdır." hata mesajı render ediliyor', async () => {
  render(<IletisimFormu />);

  const emailInput = screen.getByLabelText(/email/i);
  userEvent.type(emailInput, inCorrectFormData.email);

  await waitFor(() => {
    expect(screen.queryAllByTestId("error").length).toBe(1);
  });
});

test('soyad girilmeden gönderilirse "soyad gereklidir." mesajı render ediliyor', async () => {
  render(<IletisimFormu />);

  const nameInput = screen.getByLabelText("Ad*");
  userEvent.type(nameInput, correctFormData.name);

  // const soyadInput = screen.getByLabelText("Soyad*");
  // userEvent.type(soyadInput, inCorrectFormData.surname);

  const emailInput = screen.getByLabelText(/email/i);
  userEvent.type(emailInput, correctFormData.email);

  userEvent.click(screen.getByText("Gönder"));

  await waitFor(() => {
    expect(screen.queryByText("/soyad gereklidir./i")).toBeInTheDocument();
  });
});

test("ad,soyad, email render ediliyor. mesaj bölümü doldurulmadığında hata mesajı render edilmiyor.", async () => {});

// test("form gönderildiğinde girilen tüm değerler render ediliyor.", async () => {});
