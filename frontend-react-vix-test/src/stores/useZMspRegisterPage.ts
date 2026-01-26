import { create } from "zustand";
import { INewMSPResponse } from "../hooks/useBrandMasterResources";
import { IBrandMasterBasicInfo } from "../types/BrandMasterTypes";
import { IVMCreatedResponse } from "../types/VMTypes";

interface IMspRegisterPage {
  activeStep: 0 | 1;
  companyName: string;
  cnpj: string;
  phone: string;
  sector: string;
  contactEmail: string;
  cep: string;
  locality: string;
  countryState: string;
  city: string;
  street: string;
  streetNumber: string;
  admName: string;
  admEmail: string;
  admPhone: string;
  position: string;
  admPassword: string;
  showError: boolean;
  showErrorPageTwo: boolean;
  mspDomain: string;
  mspList: INewMSPResponse[];
  isEditing: number[];
  modalOpen:
    | null
    | "editedMsp"
    | "createdMsp"
    | "deletedMsp"
    | "registeringMsp";
  mspToBeDeleted?: INewMSPResponse | null;
  mspTableFilter: string;
  brandLogoUrl: string;
  brandObjectName: string;
  cityCode: string; 
  district: string; 
  alertMessage: string | null;
  enterOnEditing: boolean;
  showCnpjError: boolean;
  showCepError: boolean;
  showAddressFields: boolean;
  isPoc: boolean;
  isPocFilter: boolean;
  brandMasterDeleted: IBrandMasterBasicInfo | null;
  vmsToBeDeleted: IVMCreatedResponse[];
  notesBrandMasterDescription: string;
}

const INIT_STATE: IMspRegisterPage = {
  activeStep: 0,
  companyName: "",
  cnpj: "",
  phone: "",
  sector: "",
  contactEmail: "",
  cep: "",
  locality: "",
  countryState: "",
  city: "",
  street: "",
  streetNumber: "",
  admName: "",
  admEmail: "",
  admPhone: "",
  position: "admin",
  admPassword: "",
  showError: false,
  mspDomain: "",
  showErrorPageTwo: false,
  mspList: [],
  isEditing: [],
  modalOpen: null,
  mspToBeDeleted: null,
  mspTableFilter: "",
  brandLogoUrl: "",
  brandObjectName: "",
  cityCode: "",
  district: "",
  alertMessage: null,
  enterOnEditing: false,
  showCnpjError: false,
  showCepError: false,
  showAddressFields: false,
  isPoc: false,
  isPocFilter: false,
  brandMasterDeleted: null,
  vmsToBeDeleted: [],
  notesBrandMasterDescription: "",
};

const resetState = Object.fromEntries(
  Object.entries(INIT_STATE).filter(
    ([key]) => !["activeStep", "mspList", "isEditing"].includes(key),
  ),
);

interface IMspRegisterPageState extends IMspRegisterPage {
  setActiveStep: (activeStep: 0 | 1) => void;
  setCompanyName: (companyName: string) => void;
  setCnpj: (cnpj: string) => void;
  setPhone: (phone: string) => void;
  setSector: (sector: string) => void;
  setContactEmail: (contactEmail: string) => void;
  setCep: (cep: string) => void;
  setLocality: (locality: string) => void;
  setCountryState: (state: string) => void;
  setCity: (city: string) => void;
  setStreet: (street: string) => void;
  setStreetNumber: (streetNumber: string) => void;
  setAdmName: (admName: string) => void;
  setAdmEmail: (admEmail: string) => void;
  setAdmPhone: (admPhone: string) => void;
  setPosition: (position: string) => void;
  setMSPDomain: (domain: string) => void;
  setAdmPassword: (admPassword: string) => void;
  setShowError: (showError: boolean) => void;
  setShowErrorPageTwo: (showError: boolean) => void;
  resetAll: () => void;
  setMspList: (mspList: INewMSPResponse[]) => void;
  setIsEditing: (isEditing: number[]) => void;
  setModalOpen: (modalOpen: IMspRegisterPage["modalOpen"]) => void;
  setMspToBeDeleted: (mspToBeDeleted: INewMSPResponse | null) => void;
  setMspTableFilter: (mspTableFilter: string) => void;
  setBrandLogo: (params: {
    brandLogoUrl: string;
    brandObjectName: string;
  }) => void;
  setCityCode: (cityCode: string) => void;
  setDistrict: (district: string) => void;
  setAlertMessage: (alertMessage: string | null) => void;
  setEnterOnEditing: (enterOnEditing: boolean) => void;
  setShowCnpjError: (showCnpjError: boolean) => void;
  setShowCepError: (showCepError: boolean) => void;
  setShowAddressFields: (showAddressFields: boolean) => void;
  setIsPoc: (isPoc: boolean) => void;
  setIsPocFilter: (isPocFilter: boolean) => void;
  setBrandMasterDeleted: (
    brandMasterDeleted: IBrandMasterBasicInfo | null,
  ) => void;
  setVmsToBeDeleted: (vmsToBeDeleted: IVMCreatedResponse[]) => void;
  setNotesBrandMasterDescription: (notesBrandMasterDescription: string) => void;
}

export const useZMspRegisterPage = create<IMspRegisterPageState>((set) => ({
  ...INIT_STATE,
  setActiveStep: (activeStep) => set({ activeStep }),
  setCompanyName: (companyName) => set({ companyName }),
  setCnpj: (cnpj) => set({ cnpj }),
  setPhone: (phone) => set({ phone }),
  setSector: (sector) => set({ sector }),
  setContactEmail: (contactEmail) => set({ contactEmail }),
  setCep: (cep) => set({ cep }),
  setLocality: (locality) => set({ locality }),
  setCountryState: (countryState) => set({ countryState }),
  setCity: (city) => set({ city }),
  setStreet: (street) => set({ street }),
  setStreetNumber: (streetNumber) => set({ streetNumber }),
  setAdmName: (admName) => set({ admName }),
  setAdmEmail: (admEmail) => set({ admEmail }),
  setAdmPhone: (admPhone) => set({ admPhone }),
  setPosition: (position) => set({ position }),
  setMSPDomain: (mspDomain) => set({ mspDomain }),
  setAdmPassword: (admPassword) => set({ admPassword }),
  setShowError: (showError) => set({ showError }),
  setShowErrorPageTwo: (showErrorPageTwo) => set({ showErrorPageTwo }),
  resetAll: () => set((state) => ({ ...state, ...resetState })),
  setMspList: (mspList) => set({ mspList: [...mspList] }),
  setIsEditing: (isEditing) => set({ isEditing: [...isEditing] }),
  setModalOpen: (modalOpen) => set({ modalOpen }),
  setMspToBeDeleted: (mspToBeDeleted) => set({ mspToBeDeleted }),
  setMspTableFilter: (mspTableFilter) => set({ mspTableFilter }),
  setBrandLogo: ({ brandLogoUrl, brandObjectName }) =>
    set({ brandLogoUrl, brandObjectName }),
  setCityCode: (cityCode) => set({ cityCode }),
  setDistrict: (district) => set({ district }),
  setAlertMessage: (alertMessage) => set({ alertMessage }),
  setEnterOnEditing: (enterOnEditing) => set({ enterOnEditing }),
  setShowCnpjError: (showCnpjError) => set({ showCnpjError }),
  setShowCepError: (showCepError) => set({ showCepError }),
  setShowAddressFields: (showAddressFields) => set({ showAddressFields }),
  setIsPoc: (isPoc) => set({ isPoc }),
  setIsPocFilter: (isPocFilter) => set({ isPocFilter }),
  setBrandMasterDeleted: (brandMasterDeleted) => set({ brandMasterDeleted }),
  setVmsToBeDeleted: (vmsToBeDeleted) =>
    set({ vmsToBeDeleted: [...vmsToBeDeleted] }),
  setNotesBrandMasterDescription: (notesBrandMasterDescription) =>
    set({ notesBrandMasterDescription }),
}));
