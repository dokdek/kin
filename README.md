# Kin

A small and simple but maybe functional budgeting website built on React/Express/Node/MongoDB. Heavily inspired by [You Need A Budget](https://www.youneedabudget.com/)

[Kin](https://kin-site.herokuapp.com/) is currently only for private and personal usage, but there is a test account provided for trial usage.

## Features
- Create transactions and put them under certain categories/payment accounts for budgeting purposes
- User authentication
- Ability to add/delete categories
- Ability to add/delete payment accounts
- Sorting transactions by date/category/payment accounts

## Installation
- Clone project to desired location
- Install desired dependencies and start the server with commands
```bash
npm install
npm start
```
- Navigate to deployed site location
- Site requires a .env file and a serviceAccKey.json for sensitive information such as Firebase tokens and MongoDB tokens. You will need to provide these with your own keys in the format
```
ATLAS_URI=MONGODB_TOKEN_HERE
FIREBASE_API=FIREBASE_API_TOKEN_HERE
TOKEN_SECRET=JWT_TOKEN_SECRET_HERE //used for JWT auth
```
- serviceAccKey.json can be downloaded directly from Firebase, this needs to reside in the /backend/admin/ folder.

## Roadmap

[Trello](https://trello.com/b/Ex7iEibX/kin)



