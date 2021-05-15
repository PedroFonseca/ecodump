import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
} from "react";
import useGetCurrencies from "./context/useGetCurrencies";
import useGetFilters from "./context/useGetFilters";
import useGetStores from "./context/useGetStores";
import useLocalStorage from "./context/useLocalStorage";
import useRecipeCostPercentage from "./context/useRecipeCostPercentage";
import {
  CurrencyList,
  GamePrice,
  ItemPrice,
  RecipeCostPercentage,
  RecipeCraftAmmount,
  SelectedVariants,
} from "./types";
import { RecipeVariant } from "./utils/typedData";
const emptyStoresDb = {
  Version: 1,
  Stores: [],
  ExportedAtYear: 0,
  ExportedAtMonth: 0,
  ExportedAtDay: 0,
  ExportedAtHour: 0,
  ExportedAtMin: 0,
  ExportedAt: "",
};
const AppContext = React.createContext<{
  storesDb: StoresHistV1;

  filterProfessions: string[];
  setFilterProfessions: Dispatch<SetStateAction<string[]>>;
  filterCraftStations: string[];
  setFilterCraftStations: Dispatch<SetStateAction<string[]>>;
  filterName: string;
  setFilterName: Dispatch<SetStateAction<string>>;
  filterWithRecipe: boolean;
  setFilterWithRecipe: Dispatch<SetStateAction<boolean>>;

  currencyList: CurrencyList;
  setSelectedCurrency: (currencyName: string) => void;
  addNewCurrency: (
    currencyName: string,
    symbol: string,
    currencyToCopy: string
  ) => void;
  deleteCurrency: (currencyName: string) => void;
  resetCurrency: (currencyName: string) => void;
  updatePrice: (
    itemName: string,
    newPrice: number | undefined,
    currencyName?: string
  ) => void;
  currencySymbol: string;
  personalPrices: ItemPrice[];
  gamePrices: { [key: string]: GamePrice[] };

  selectedVariants: SelectedVariants;
  setSelectedVariants: Dispatch<SetStateAction<SelectedVariants>>;
  getRecipeCraftAmmount: (recipeName: string) => number;
  updateRecipeCraftAmmount: (recipeName: string, newAmmount: number) => void;

  getRecipeCostPercentage: (recipe: RecipeVariant) => RecipeCostPercentage;
  updateRecipeCostPercentage: (
    recipe: RecipeVariant,
    prodName: string,
    newPercentage: number
  ) => void;
}>({
  storesDb: emptyStoresDb,

  filterProfessions: [],
  setFilterProfessions: () => undefined,
  filterCraftStations: [],
  setFilterCraftStations: () => undefined,
  filterName: "",
  setFilterName: () => undefined,
  filterWithRecipe: true,
  setFilterWithRecipe: () => undefined,

  currencyList: { selectedCurrency: "", currencies: [] },
  setSelectedCurrency: () => undefined,
  addNewCurrency: () => undefined,
  deleteCurrency: () => undefined,
  resetCurrency: () => undefined,
  updatePrice: () => undefined,
  currencySymbol: "",
  personalPrices: [],
  gamePrices: {},

  selectedVariants: {},
  setSelectedVariants: () => undefined,
  getRecipeCraftAmmount: () => 0,
  updateRecipeCraftAmmount: () => undefined,

  getRecipeCostPercentage: () => ({ recipeKey: "", percentages: [] }),
  updateRecipeCostPercentage: () => undefined,
});

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const { storesDb, fetchedGameCurrencies } = useGetStores();
  const {
    currencyList,
    setSelectedCurrency,
    addNewCurrency,
    deleteCurrency,
    resetCurrency,
    updatePrice,
    currencySymbol,
    personalPrices,
    gamePrices,
    updateWithGameCurrencies,
  } = useGetCurrencies();
  const filters = useGetFilters();

  const { getRecipeCostPercentage, updateRecipeCostPercentage } =
    useRecipeCostPercentage();

  const [selectedVariants, setSelectedVariants] =
    useLocalStorage<SelectedVariants>("selectedVariant", {});

  const [recipeCraftAmmounts, setRecipeCraftAmmounts] =
    useLocalStorage<RecipeCraftAmmount>("RecipeCraftAmmount", {});

  const getRecipeCraftAmmount = useCallback(
    (recipeName: string) => recipeCraftAmmounts[recipeName] ?? 100,
    [recipeCraftAmmounts]
  );

  const updateRecipeCraftAmmount = useCallback(
    (recipeName: string, newAmmount: number) => {
      setRecipeCraftAmmounts((prev) => ({ ...prev, [recipeName]: newAmmount }));
    },
    [setRecipeCraftAmmounts]
  );

  // Update currency list with fetchedGameCurrencies
  useEffect(() => {
    fetchedGameCurrencies != null &&
      updateWithGameCurrencies(fetchedGameCurrencies);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchedGameCurrencies]);

  return (
    <AppContext.Provider
      value={{
        storesDb: storesDb ?? emptyStoresDb,
        ...filters,

        currencyList,
        setSelectedCurrency,
        addNewCurrency,
        deleteCurrency,
        resetCurrency,
        updatePrice,
        currencySymbol,
        personalPrices,
        gamePrices,

        selectedVariants,
        setSelectedVariants,
        getRecipeCraftAmmount,
        updateRecipeCraftAmmount,

        getRecipeCostPercentage,
        updateRecipeCostPercentage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
