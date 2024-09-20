import React, { useState, useCallback } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { AntDesign } from "@expo/vector-icons";

interface DropdownItem {
  label: string;
  value: string;
}

interface DropdownComponentProps {
  data: DropdownItem[];
  label: string;
  onChange: (value: string) => void;
}

const Label: React.FC<{
  value: string | null;
  isFocus: boolean;
  label: string;
}> = ({ value, isFocus, label }) =>
  value || isFocus ? (
    <Text style={[styles.label, isFocus && { color: "blue" }]}>{label}</Text>
  ) : null;

const DropdownComponent: React.FC<DropdownComponentProps> = ({
  data,
  label,
  onChange,
}) => {
  const [value, setValue] = useState<string | null>(null);
  const [isFocus, setIsFocus] = useState(false);

  const handleChange = useCallback(
    (item: DropdownItem) => {
      setValue(item.value);
      onChange(item.label);
      setIsFocus(false);
    },
    [onChange]
  );

  return (
    <View style={styles.container}>
      <Label value={value} isFocus={isFocus} label={label} />
      <Dropdown
        style={[styles.dropdown, isFocus && styles.dropdownFocus]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={data}
        search
        maxHeight={300}
        minHeight={100}
        labelField="label"
        valueField="value"
        searchField="value"
        placeholder={!isFocus ? "Select System prompt" : "..."}
        searchPlaceholder="Search..."
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={handleChange}
        renderLeftIcon={() => (
          <AntDesign
            style={styles.icon}
            color={isFocus ? "blue" : "black"}
            name="idcard"
            size={20}
          />
        )}
      />
    </View>
  );
};

export default DropdownComponent;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 16,
  },
  dropdown: {
    height: 50,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: "absolute",
    backgroundColor: "white",
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  dropdownFocus: {
    borderColor: "blue",
  },
});
