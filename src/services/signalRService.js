import * as signalR from "@microsoft/signalr";

class SignalRService {
  constructor() {
    this.connection = null;
  }

  async startConnection() {
    try {
      this.connection = new signalR.HubConnectionBuilder()
        .withUrl("https://localhost:7112/pawfundhub")
        .withAutomaticReconnect()
        .build();

      await this.connection.start();
      console.log("SignalR Connected!");
    } catch (err) {
      console.error("SignalR Connection Error:", err);
      setTimeout(() => this.startConnection(), 5000);
    }
  }

  addPetStatusListener(callback) {
    this.connection.on("PetStatusUpdated", (petName, status) => {
      callback(petName, status);
    });
  }

  addDonationListener(callback) {
    this.connection.on("DonationAdded", (petName, amount) => {
      callback(petName, amount);
    });
  }

  removeListeners() {
    this.connection.off("PetStatusUpdated");
    this.connection.off("DonationAdded");
  }

  async stopConnection() {
    if (this.connection) {
      try {
        await this.connection.stop();
        console.log("SignalR Disconnected");
      } catch (err) {
        console.error("SignalR Disconnection Error:", err);
      }
    }
  }
}

export default new SignalRService();
