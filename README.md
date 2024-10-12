# Blockchain Price Tracker

A robust Blockchain Price Tracker application built with **Nest.js**. This application automatically tracks the prices of **Ethereum** and **Polygon**, sends alerts based on price fluctuations, and provides APIs for retrieving historical prices and swap rates.

## Features

- **Price Tracking**: Automatically saves the price of Ethereum and Polygon every 5 minutes.
- **Price Alerts**: Sends email notifications if the price of a chain increases by more than 3% compared to its price one hour ago.
- **API Endpoints**:
  - **Retrieve Historical Prices**: Fetch the prices for Ethereum and Polygon for the past 24 hours.
  - **Set Price Alerts**: Allow users to set alerts for specific price thresholds.
    - Example: Set an alert for Ethereum at $1000, which sends an email when the price hits this value.
  - **Swap Rate Calculation**: Provides an API to get the Ethereum to Bitcoin swap rate.
    - Input: Amount of Ethereum.
    - Output: Amount of Bitcoin received and total fees (both in ETH and USD, with a fee percentage of 0.03%).

## Technologies Used

- **Nest.js**: A progressive Node.js framework for building efficient and scalable server-side applications.
- **TypeORM**: An ORM that works well with TypeScript and supports various database systems, including PostgreSQL.
- **Docker**: The application is dockerized for easy setup and deployment on local machines.
- **Swagger**: Documentation for API endpoints, enabling easy exploration of available functionalities.

## Getting Started

### Prerequisites

- Node.js
- Docker (optional, for containerization)
- PostgreSQL database

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/blockchain-price-tracker.git
   cd blockchain-price-tracker

2. Install dependencies:
   ```bash
   npm install
   
3. Create a .env file in the root directory and configure your database credentials.
4. Run the application:
    ```bash
    npm run start
    ```

   Or if using Docker:
    ```bash
    docker-compose up --build
  
### Contributing
Contributions are welcome! Please open an issue or submit a pull request for any improvements or suggestions.

### License
This project is licensed under the MIT License.
