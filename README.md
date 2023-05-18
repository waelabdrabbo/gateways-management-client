# Gateways Managment React

This sample project manages gateways - The REST service (JSON/HTTP) stores information about these gateways and their associated devices in a database.

## Table of Contents

- [Project Overview](#project-overview)
- [Installation](#installation)
- [Features](#features)
- [Technologies](#technologies)

## Project Overview

The project provides a REST service for performing CRUD operations on gateways and their devices. The service enforces validation rules for gateway fields and limits the number of peripheral devices to 10 per gateway.

## Installation

Run `npm run dev` for a dev server. Navigate to `http://localhost:5173/`. The app will automatically reload if you change any of the source files.

Set up the database connection by providing the necessary configuration details in `.env` file.


## Features

Create, read, update, and delete gateways
Add and remove devices from a gateway
Validation of gateway fields
Limit of 10 peripheral devices per gateway

## Technologies

The project is built using the following technologies:
React
Redux
Node.js
Express.js
MongoDB
