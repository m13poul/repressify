import { ClientSideContext } from "../../contexts/clientContext";
import { useContext } from "react";
import { QRCodeSVG, QRCodeCanvas } from "qrcode.react";
import { jsPDF } from "jspdf";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import "./passwordRecovery.styles.scss";
import UtilButton from "../UtilButton/UtilButton.component";
import pdf from "@react-pdf/renderer";
import { MdFileDownload } from "react-icons/md";
import QRCode from "qrcode";
import titleFont from "../../assets/RampartOne-Regular.ttf";
import garamond from "../../assets/EB_Garamond/static/EBGaramond-Medium.ttf";
const { Text, View, StyleSheet, Document, Page, PDFViewer, PDFDownloadLink, Svg, Image, Font } = pdf;

Font.register({
  family: "Rampart One",
  format: "cursive",
  src: titleFont,
});
Font.register({
  family: "EB Garamond",
  format: "serif",
  src: garamond,
});

// Create styles
const styles = StyleSheet.create({
  body: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
  },
  title: {
    textAlign: "center",

    fontFamily: "Rampart One",
    fontWeight: "bold",
    fontSize: 25,
  },
  header: {
    backgroundColor: "#7f1d1d",
    color: "wheat",
    paddingTop: 20,
    paddingBottom: 20,
  },
  section: {
    margin: 10,
    padding: 10,
  },
  recoveryText: {
    textAlign: "center",
    fontFamily: "EB Garamond",
  },
  image: {
    width: 200,
    height: 200,
    marginLeft: "auto",
    marginRight: "auto",
  },
  notice: {
    textAlign: "center",
    fontFamily: "EB Garamond",
    marginTop: 20,
    marginBottom: 20,
  },
  buttomNotice: {
    textAlign: "center",
    fontFamily: "EB Garamond",
    marginTop: 100,
  },
  subtitle: {
    textAlign: "center",
    fontFamily: "EB Garamond",
  },
});

// Create Document Component
export const MyDocument = () => {
  const recovery = localStorage.getItem("recovery");
  const encoded: any = localStorage.getItem("encoded");
  return (
    <Document>
      <Page size="A4" style={styles.body}>
        <View style={styles.section}>
          <View style={styles.header}>
            <Text style={styles.title}>{`</Re-Pressify>`}</Text>
            <Text style={styles.subtitle}>Minimal Newsreader & Podcast Listener</Text>
          </View>

          <Text style={styles.notice}>This is a recovery key, in order to reset your password, should you ever need to. Keep it some place safe!</Text>
        </View>
        <View style={styles.section}>
          <Image src={encoded} style={styles.image}></Image>
          <Text style={styles.recoveryText}>{recovery}</Text>
          <Text style={styles.buttomNotice}>Printed at {JSON.stringify(new Date()).toString()}</Text>
        </View>
      </Page>
    </Document>
  );
};
function PasswordRecovery() {
  const [data, dispatch] = useContext(ClientSideContext);
  data.recovery ? localStorage.setItem("recovery", data.recovery) : null;
  const generateQR = async (text: string) => {
    try {
      const encoded = await QRCode.toDataURL(text);
      localStorage.setItem("encoded", encoded);
    } catch (err) {
      // console.error(err);
    }
  };
  generateQR(localStorage.getItem("recovery") || "");
  const removeRecovery = () => {
    setTimeout(() => {
      localStorage.removeItem("recovery");
      localStorage.removeItem("encoded");
      dispatch({ type: "SET_RECOVERY", payload: "" });
    }, 5000);
  };
  return (
    <div>
      {data.recovery ? (
        <div>
          <div className="recoveryGrid">
            <p>
              <span className="recovery-notice">Important Notice!!! </span>{" "}
              <span className="recovery-text">
                <br /> Should you ever need to recover you password, use the key attached to this file. <br />
                Keep it some place safe. It won't be shown again!
              </span>
            </p>
          </div>
          <PDFDownloadLink document={<MyDocument />} fileName="Re-Pressify_recovery.pdf">
            {({ loading }) =>
              loading ? (
                <button>Loading document...</button>
              ) : (
                <div className="recoveryGrid">
                  <UtilButton color="utilButton-green" actionToDo={removeRecovery} icon={<MdFileDownload />}>
                    Save recovery key
                  </UtilButton>
                </div>
              )
            }
          </PDFDownloadLink>
        </div>
      ) : null}
    </div>
  );
}

export default PasswordRecovery;
