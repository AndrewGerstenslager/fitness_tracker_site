# Fitness Tracker Data Analysis Web Application

## CS6065 Cloud Computing Final Project
**Authors:** Andrew Gerstenslager & Jack Margeson

## Project Overview
This project implements a web application for analyzing and visualizing fitness tracker data. The application will be hosted on Azure for the final deployment, but this repository contains the local development version.

### Dataset
The project uses a synthetic fitness tracker dataset from Kaggle that includes:
- Daily activity metrics (steps, calories, distance)
- Health measurements (heart rate, sleep hours)
- Contextual information (weather, location, mood)
- Workout details and user information

[Dataset Source](https://www.kaggle.com/datasets/arnavsmayan/fitness-tracker-dataset)

## Repository Structure
- `website/` - Web application source code
- `database/` - Scripts for local MySQL database setup
- `data/` - Fitness tracker dataset files
- `requirements.txt` - Python dependencies

## Local Development Setup

### Prerequisites
- Python 3.x
- MySQL Server
- Required Python packages (install via `pip install -r requirements.txt`)

### Database Setup
1. Install MySQL locally
2. Run the database setup script:
