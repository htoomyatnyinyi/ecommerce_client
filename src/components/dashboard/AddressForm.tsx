import React, { useEffect, useState } from "react";
import { Address } from "../types";
import { api } from "../api";

interface AddressFormProps {
  userId: string;
  onSelectAddress: (
    shippingAddressId: string,
    billingAddressId: string
  ) => void;
}

const AddressForm: React.FC<AddressFormProps> = ({
  userId,
  onSelectAddress,
}) => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [newAddress, setNewAddress] = useState({
    street: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    isDefault: false,
  });
  const [selectedShipping, setSelectedShipping] = useState<string>("");
  const [selectedBilling, setSelectedBilling] = useState<string>("");

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const data = await api.getAddresses(userId);
        setAddresses(data);
      } catch (error) {
        console.error("Error fetching addresses:", error);
      }
    };
    fetchAddresses();
  }, [userId]);

  const handleCreateAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const createdAddress = await api.createAddress({ ...newAddress, userId });
      setAddresses([...addresses, createdAddress]);
      setNewAddress({
        street: "",
        city: "",
        state: "",
        country: "",
        postalCode: "",
        isDefault: false,
      });
    } catch (error) {
      console.error("Error creating address:", error);
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Select or Add Address</h2>

      {/* Existing Addresses */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold">Shipping Address</h3>
        {addresses.map((address) => (
          <div key={address.id} className="flex items-center mb-2">
            <input
              type="radio"
              name="shippingAddress"
              value={address.id}
              checked={selectedShipping === address.id}
              onChange={() => setSelectedShipping(address.id)}
              className="mr-2"
            />
            <p>
              {address.street}, {address.city}, {address.country},{" "}
              {address.postalCode}
            </p>
          </div>
        ))}
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold">Billing Address</h3>
        {addresses.map((address) => (
          <div key={address.id} className="flex items-center mb-2">
            <input
              type="radio"
              name="billingAddress"
              value={address.id}
              checked={selectedBilling === address.id}
              onChange={() => setSelectedBilling(address.id)}
              className="mr-2"
            />
            <p>
              {address.street}, {address.city}, {address.country},{" "}
              {address.postalCode}
            </p>
          </div>
        ))}
      </div>

      {/* New Address Form */}
      <h3 className="text-lg font-semibold mb-2">Add New Address</h3>
      <form onSubmit={handleCreateAddress} className="space-y-4">
        <input
          type="text"
          placeholder="Street"
          value={newAddress.street}
          onChange={(e) =>
            setNewAddress({ ...newAddress, street: e.target.value })
          }
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="City"
          value={newAddress.city}
          onChange={(e) =>
            setNewAddress({ ...newAddress, city: e.target.value })
          }
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="State (optional)"
          value={newAddress.state}
          onChange={(e) =>
            setNewAddress({ ...newAddress, state: e.target.value })
          }
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Country"
          value={newAddress.country}
          onChange={(e) =>
            setNewAddress({ ...newAddress, country: e.target.value })
          }
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Postal Code"
          value={newAddress.postalCode}
          onChange={(e) =>
            setNewAddress({ ...newAddress, postalCode: e.target.value })
          }
          className="w-full p-2 border rounded"
          required
        />
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={newAddress.isDefault}
            onChange={(e) =>
              setNewAddress({ ...newAddress, isDefault: e.target.checked })
            }
            className="mr-2"
          />
          Set as default address
        </label>
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Add Address
        </button>
      </form>

      {/* Proceed Button */}
      <button
        onClick={() => onSelectAddress(selectedShipping, selectedBilling)}
        disabled={!selectedShipping || !selectedBilling}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        Proceed to Payment
      </button>
    </div>
  );
};

export default AddressForm;
