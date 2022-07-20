import { StyleSheet, Text, View } from "react-native";
import React from "react";
import {
  request,
  requestMultiple,
  PERMISSIONS,
} from "react-native-permissions";

export default function Permissions(props) {
  request(PERMISSIONS.ANDROID.CAMERA).then((r1) => {
    request(PERMISSIONS.ANDROID.RECORD_AUDIO).then((r2) => {
      console.log("CAMERA", r1);
      console.log("MIC", r2);
    });
  });
  return null;
}

const styles = StyleSheet.create({});
