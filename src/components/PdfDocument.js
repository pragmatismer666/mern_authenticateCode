import React from "react";
import {
    Page,
    Text,
    View,
    Document,
    StyleSheet,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
    page: {
        backgroundColor: "#ffffff"
    },
    codeContainer: {
        backgroundColor: "#f6f6f5",
        display: "flex",
        flexDirection: "row",
        padding: 5
    },
    codeDetails: {
        display: "flex",
        marginLeft: 5
    },
    codeTitle: {
        fontSize: 15,
        marginBottom: 10
    }
});

export function PdfDocument(props) {
    return (
        <Document>
            <Page style={styles.page}>
                {props.data
                    ? props.data.map((code, index) => {
                        return (
                            <View key={index} style={styles.codeContainer}>
                                <View style={styles.codeDetails}>
                                    <Text style={styles.codeTitle}>{code}</Text>
                                </View>
                            </View>
                        );
                    })
                    : ""}
            </Page>
        </Document>
    );
} 