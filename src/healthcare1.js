import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

const Healthcare = () => {
  // State variables... (no changes here)
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [providerAddress, setProviderAddress] = useState("");
  const [fetchPatientID, setFetchPatientID] = useState("");
  const [patientRecords, setPatientRecords] = useState([]);
  const [addPatientID, setAddPatientID] = useState("");
  const [patientName, setPatientName] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [treatment, setTreatment] = useState("");
  const [recordCategory, setRecordCategory] = useState(0);
  const [registerPatientAddress, setRegisterPatientAddress] = useState("");
  const [registerPatientID, setRegisterPatientID] = useState("");
  const [myRecords, setMyRecords] = useState([]);

  // --- ACTION REQUIRED ---
  // 1. Paste your deployed contract address here
  const contractAddress = "0xc9961f1544d98f172efae63be562ecf16446633c";

  // --- 🚨 THIS IS THE FIX 🚨 ---
  // 2. Paste the address of the wallet that deployed the contract (the owner)
  const ownerAddress = "0x8113efF1454B112F10c19D95cEeeF21Ac1a58d08";

  // Your ABI remains the same
  const contractABI = [
    {
      inputs: [],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "uint256",
          name: "patientID",
          type: "uint256",
        },
        {
          indexed: true,
          internalType: "address",
          name: "patientAddress",
          type: "address",
        },
      ],
      name: "PatientRegistered",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "uint256",
          name: "patientID",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "recordID",
          type: "uint256",
        },
        {
          indexed: true,
          internalType: "address",
          name: "provider",
          type: "address",
        },
      ],
      name: "RecordAdded",
      type: "event",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "patientID",
          type: "uint256",
        },
        {
          internalType: "string",
          name: "patientName",
          type: "string",
        },
        {
          internalType: "string",
          name: "diagnosis",
          type: "string",
        },
        {
          internalType: "string",
          name: "treatment",
          type: "string",
        },
        {
          internalType: "enum HealthcareRecords.RecordType",
          name: "category",
          type: "uint8",
        },
      ],
      name: "addRecord",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "provider",
          type: "address",
        },
      ],
      name: "authorizeProvider",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "getMyRecords",
      outputs: [
        {
          components: [
            {
              internalType: "uint256",
              name: "recordID",
              type: "uint256",
            },
            {
              internalType: "string",
              name: "patientName",
              type: "string",
            },
            {
              internalType: "string",
              name: "diagnosis",
              type: "string",
            },
            {
              internalType: "string",
              name: "treatment",
              type: "string",
            },
            {
              internalType: "uint256",
              name: "timestamp",
              type: "uint256",
            },
            {
              internalType: "enum HealthcareRecords.RecordType",
              name: "category",
              type: "uint8",
            },
          ],
          internalType: "struct HealthcareRecords.Record[]",
          name: "",
          type: "tuple[]",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "patientID",
          type: "uint256",
        },
      ],
      name: "getPatientRecords",
      outputs: [
        {
          components: [
            {
              internalType: "uint256",
              name: "recordID",
              type: "uint256",
            },
            {
              internalType: "string",
              name: "patientName",
              type: "string",
            },
            {
              internalType: "string",
              name: "diagnosis",
              type: "string",
            },
            {
              internalType: "string",
              name: "treatment",
              type: "string",
            },
            {
              internalType: "uint256",
              name: "timestamp",
              type: "uint256",
            },
            {
              internalType: "enum HealthcareRecords.RecordType",
              name: "category",
              type: "uint8",
            },
          ],
          internalType: "struct HealthcareRecords.Record[]",
          name: "",
          type: "tuple[]",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "patientAddress",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "patientID",
          type: "uint256",
        },
      ],
      name: "registerPatient",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
  ];
  const recordCategories = ["Consultation", "Prescription", "LabResult"];

  useEffect(() => {
    const connectWallet = async () => {
      if (window.ethereum) {
        try {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          await provider.send("eth_requestAccounts", []);
          const signer = provider.getSigner();
          const accountAddress = await signer.getAddress();
          const contract = new ethers.Contract(
            contractAddress,
            contractABI,
            signer
          );

          setProvider(provider);
          setSigner(signer);
          setAccount(accountAddress);
          setContract(contract);

          // This check ensures the "Authorize" section appears only for the owner
          if (ownerAddress) {
            setIsOwner(
              accountAddress.toLowerCase() === ownerAddress.toLowerCase()
            );
          }
        } catch (error) {
          console.error("Error connecting to wallet: ", error);
        }
      } else {
        alert("Please install MetaMask!");
      }
    };
    connectWallet();
  }, []);

  // --- All other functions remain the same ---
  // ... (addRecord, getMyRecords, fetchPatientRecords, etc.)
  const fetchPatientRecords = async () => {
    if (!fetchPatientID) {
      alert("Please enter a Patient ID");
      return;
    }
    try {
      const records = await contract.getPatientRecords(fetchPatientID);
      setPatientRecords(records);
    } catch (error) {
      console.error("Error fetching patient records", error);
      alert("Failed to fetch records. Are you an authorized provider?");
    }
  };

  const addRecord = async () => {
    try {
      const tx = await contract.addRecord(
        addPatientID,
        patientName,
        diagnosis,
        treatment,
        recordCategory
      );
      await tx.wait();
      alert("Record added successfully!");
    } catch (error) {
      console.error("Error adding record:", error);
      alert("Failed to add record.");
    }
  };

  const authorizeProvider = async () => {
    if (!isOwner) {
      alert("Only the contract owner can perform this action.");
      return;
    }
    try {
      const tx = await contract.authorizeProvider(providerAddress);
      await tx.wait();
      alert(`Provider ${providerAddress} authorized successfully`);
    } catch (error) {
      console.error("Error authorizing provider:", error);
    }
  };

  const registerPatient = async () => {
    try {
      const tx = await contract.registerPatient(
        registerPatientAddress,
        registerPatientID
      );
      await tx.wait();
      alert("Patient registered successfully!");
    } catch (error) {
      console.error("Error registering patient:", error);
      alert(
        "Failed to register patient. Check if the address or ID is already registered."
      );
    }
  };

  const getMyRecords = async () => {
    try {
      const records = await contract.getMyRecords();
      setMyRecords(records);
      if (records.length === 0) {
        alert("No records found for your account.");
      }
    } catch (error) {
      console.error("Error fetching your records:", error);
      alert("Failed to fetch your records. Are you a registered patient?");
    }
  };

  const renderRecords = (records) => {
    return records.map((record, index) => (
      <div key={index} className="record-item">
        <p>
          <b>Record ID:</b> {record.recordID.toString()}
        </p>
        <p>
          <b>Patient Name:</b> {record.patientName}
        </p>
        <p>
          <b>Diagnosis:</b> {record.diagnosis}
        </p>
        <p>
          <b>Treatment:</b> {record.treatment}
        </p>
        <p>
          <b>Category:</b> {recordCategories[record.category]}
        </p>
        <p>
          <b>Timestamp:</b>{" "}
          {new Date(record.timestamp.toNumber() * 1000).toLocaleString()}
        </p>
      </div>
    ));
  };

  // --- The JSX / UI Part ---
  return (
    <div className="container">
      <h1 className="title">Healthcare Records dApp</h1>
      {account && <p className="account-info">Connected Account: {account}</p>}
      {isOwner && <p className="owner-info">Role: Contract Owner</p>}

      <div className="section">
        <h2>Patient Actions</h2>
        <button className="action-button" onClick={getMyRecords}>
          View My Records
        </button>
        {myRecords.length > 0 && (
          <div className="records-section">
            <h3>Your Medical Records:</h3>
            {renderRecords(myRecords)}
          </div>
        )}
      </div>

      <hr />

      <div className="section">
        <h2>Healthcare Provider Actions</h2>

        <div className="form-section">
          <h3>Register a New Patient</h3>
          <input
            className="input-field"
            type="text"
            placeholder="Patient's Wallet Address"
            value={registerPatientAddress}
            onChange={(e) => setRegisterPatientAddress(e.target.value)}
          />
          <input
            className="input-field"
            type="text"
            placeholder="Assign a Patient ID"
            value={registerPatientID}
            onChange={(e) => setRegisterPatientID(e.target.value)}
          />
          <button className="action-button" onClick={registerPatient}>
            Register Patient
          </button>
        </div>

        <div className="form-section">
          <h3>Add Patient Record</h3>
          <input
            className="input-field"
            type="text"
            placeholder="Patient ID"
            value={addPatientID}
            onChange={(e) => setAddPatientID(e.target.value)}
          />
          <input
            className="input-field"
            type="text"
            placeholder="Patient Name"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
          />
          <input
            className="input-field"
            type="text"
            placeholder="Diagnosis"
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
          />
          <input
            className="input-field"
            type="text"
            placeholder="Treatment"
            value={treatment}
            onChange={(e) => setTreatment(e.target.value)}
          />
          <select
            className="input-field"
            value={recordCategory}
            onChange={(e) => setRecordCategory(e.target.value)}
          >
            <option value="0">Consultation</option>
            <option value="1">Prescription</option>
            <option value="2">Lab Result</option>
          </select>
          <button className="action-button" onClick={addRecord}>
            Add Record
          </button>
        </div>

        <div className="form-section">
          <h3>Fetch Patient Records</h3>
          <input
            className="input-field"
            type="text"
            placeholder="Enter Patient ID"
            value={fetchPatientID}
            onChange={(e) => setFetchPatientID(e.target.value)}
          />
          <button className="action-button" onClick={fetchPatientRecords}>
            Fetch Records
          </button>
          {patientRecords.length > 0 && (
            <div className="records-section">
              <h4>Fetched Records:</h4>
              {renderRecords(patientRecords)}
            </div>
          )}
        </div>
      </div>

      <hr />

      {/* This section will now correctly appear once you update the ownerAddress variable */}
      {isOwner && (
        <div className="section">
          <h2>Contract Owner Actions</h2>
          <div className="form-section">
            <h3>Authorize Healthcare Provider</h3>
            <input
              className="input-field"
              type="text"
              placeholder="Provider Address"
              value={providerAddress}
              onChange={(e) => setProviderAddress(e.target.value)}
            />
            <button className="action-button" onClick={authorizeProvider}>
              Authorize Provider
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Healthcare;
