import { View, Text, StyleSheet } from "react-native";
import React, { useState } from "react";
import { Feather } from "@expo/vector-icons";
import { useTheme, Searchbar } from "react-native-paper";

interface SearchBarProps {}

const SearchBar = ({}: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = React.useState("");

  const onChangeSearch = (query: string) => setSearchQuery(query);

  return (
    <View>
      <Searchbar
        value={searchQuery}
        onChangeText={onChangeSearch}
        placeholder="Search"
        style={{ width: 200, marginRight: 20 }}
        elevation={0}
        clearIcon={({ size, color }) => (
          <Feather name="x" size={size} color={color} />
        )}
      />
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  searchIcon: {
    marginRight: 12,
  },
});
