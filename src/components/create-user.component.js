import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class CreateUser extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
    };

    this.onChangeUsername = this.onChangeUsername.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChangeUsername(e) {
    this.setState({
      username: e.target.value,
    });
  }

  onSubmit(e) {
    e.preventDefault();

    const user = {
      username: this.state.username,
    };

    console.log(user);
  }

  render() {
    return (
      <form className="w-full max-w-sm" onSubmit={this.onSubmit}>
        <div className="md:flex md:items-center mb-6 mt-6">
          <div className="md:w-1/3">
            <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
              Username
            </label>
          </div>
          <div className="md:w-2/3">
            <input
              className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
              type="text"
              value={this.state.username}
              onChange={this.onChangeUsername}
            ></input>
          </div>
        </div>
        <div className="md:flex md:items-center">
          <div className="md:w-3/4"></div>
          <div className="md:w-2/3">
            <button
              className="shadow bg-teal-500 hover:bg-teal-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
              type="submit"
            >
              Create New User
            </button>
          </div>
        </div>
      </form>
    );
  }
}
