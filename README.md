# Chit Fund Management System

## Overview
The **Chit Fund Management System** is a microservices-based application that modernizes traditional chit fund operations by automating user and group management, transaction tracking, and monthly bidding. It also features an AI-powered chatbot for user assistance.

## Features
- **User Management**: Secure authentication, profile management, and user roles.
- **Group Management**: Create, manage, and track chit fund groups with automated participant handling.
- **Join Requests & Approvals**: Users request to join groups, and organizers manage approvals.
- **Chit Plan & Monthly Bidding**: Dynamic chit plan generation and automated winner selection.
- **Transaction Management**: Secure contribution tracking, fund allocation, and payouts.
- **AI Chatbot (Gemini API)**: Provides assistance on chit fund operations and user queries.

## Tech Stack
- **Backend**: Spring Boot (Java), WebFlux, Spring Data JPA
- **Frontend**: Angular CLI
- **Database**: MySQL
- **AI Chatbot**: Gemini API for user assistance
- **Communication**: WebClient for microservice interaction

## Architecture
The project follows a **microservices architecture**, ensuring scalability and modularity:
- **User Service**: Manages user authentication & profiles
- **Group Service**: Handles group creation, member management, and chit plan generation
- **Transaction Service**: Logs and manages financial transactions
- **AI Chatbot Service**: Provides chit fund assistance via Gemini API
