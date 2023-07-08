import React from "react";
import { StyleSheet } from "react-native";
import { Avatar, Modal, Text, useTheme } from "react-native-paper";

const NoInternetModal = () => {
  const theme = useTheme();
  return (
    <Modal
      visible
      dismissable={false}
      contentContainerStyle={{
        backgroundColor: theme.colors.background,
        width: "90%",
        alignSelf: "center",
        padding: 30,
      }}
    >
      <Avatar.Icon icon={"wifi"} size={80} style={{ alignSelf: "center" }} />
      <Text
        style={{
          textAlign: "center",
          marginVertical: 16,
          fontSize: 20,
          fontWeight: "700",
        }}
      >
        Internet required
      </Text>
      <Text
        style={{
          textAlign: "justify",
          fontSize: 16,
          opacity: 0.7,
          fontWeight: "600",
        }}
      >
        Sorry for the inconvenience. To ensure that the app has a smaller file
        size, it requires internet access. Please enable Wi-Fi or connect to the
        internet to use the app.
      </Text>
    </Modal>
  );
};

export default NoInternetModal;

const styles = StyleSheet.create({});
