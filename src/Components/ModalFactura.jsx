import React from "react";
import { Button, Header, Image, Modal, Divider } from "semantic-ui-react";
import { Grid, GridColumn as Column } from "@progress/kendo-react-grid";
import { PDFExport, savePDF } from "@progress/kendo-react-pdf";
const initialSort = [
  {
    field: "materie",
    dir: "des",
  },
];
function ModalFactura({ setOpen, open, dataFactura, elev }) {
  const pdfExportComponent = React.useRef(null);

  let id = 0;
  //TO DO DE PUS BLOC SI APARTAMENT
  const [sort, setSort] = React.useState(initialSort);
  const ID = () => {
    ++id;
    return <td>{id}</td>;
  };
  const paymentMethod = (props) => {
    const style = {
      color: "red",
    };
    if (props.dataItem["starePlata"] === "neplatit")
      return <td style={style}>{props.dataItem["Pret"]}</td>;
    else
      return (
        <td style={{ color: "green" }}>
          {props.dataItem["Pret"]}(A fost platita)
        </td>
      );
  };
  const exportPDFWithComponent = () => {
    if (pdfExportComponent.current) {
      pdfExportComponent.current.save();
    }
  };
  const ReturnDate = (props) => {
    return (
      <td>
        {new Date(props.dataItem["data"].seconds * 1000).toLocaleDateString()}
      </td>
    );
  };

  return (
    <Modal
      scrolling
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      style={{ width: "100%" }}
    >
      <Modal.Header>O_{dataFactura?.numarFactura}</Modal.Header>
      <Modal.Content
        scrolling={true}
        style={{ height: "90vh", maxHeight: "80vh" }}
      >
        <PDFExport
          ref={pdfExportComponent}
          paperSize="A4"
          scale={0.6}
          margin="2cm"
        >
          <div>
            <h1>Factura</h1>
            <h3>Seria MAD Numar {dataFactura?.numarFactura}</h3>
            <br />
            <h4>Data: {dataFactura?.dataEmitere}</h4>
            <h4>
              Scadent la{" "}
              {new Date(
                dataFactura?.scadenta?.seconds * 1000
              ).toLocaleDateString()}
            </h4>
            <h4 style={{ paddingLeft: "90%" }}>-RON-</h4>
            <div class="row">
              <div class="column" style={{ width: "50%" }}>
                <div style={{ paddingLeft: "5%" }}>
                  <h2>Furnizor</h2>
                  <Divider style={{ height: "5px", backgroundColor: "grey" }} />
                  <h3>MANIERA ART DEPARTMENT SRL</h3>
                  <br />
                  <div style={{ display: "flex", gap: "7%" }}>
                    <h3>CIF 38846962 </h3>
                    <h3>RC J40/1981/2018</h3>
                  </div>
                  <div style={{ width: "50%" }}>
                    Capital soc. 210 RON BUCURESTI sect. 1 str. BOTEANU nr. 3A
                    ap. 39 Telefon 031 109 9144 Email clubmaniera@gmail.com
                    Banca BANCA ROMANA DE DEZVOLTARE DRISTOR
                    IBANRO69BRDE441SV22839824410
                  </div>
                </div>
              </div>
              <div class="column" style={{ width: "50%" }}>
                <h2>Client</h2>

                <Divider style={{ height: "5px", backgroundColor: "grey" }} />
                <h2>{elev?.numeFactura}</h2>
                <h3>
                  CIF {elev?.serieBuletinFactura}
                  {elev?.numarBuletinFactura}
                </h3>
                <h3>
                  Ors.{" "}
                  {elev?.orasFactura +
                    ", str. " +
                    elev?.stradaFactura +
                    ", nr. " +
                    elev?.numarAdresaFactura +
                    ", jud." +
                    elev?.judetFactura}
                </h3>
              </div>
            </div>
          </div>
          <Modal.Description>
            <br />
            <br />
            <Grid style={{ border: "2px solid" }} data={dataFactura.sedinte}>
              <Column field="ID" title="Nr. crt." cell={ID} />
              <Column field="data" title="Data" cell={ReturnDate} />

              <Column field="materie" title="Materie" filterable={false} />
              <Column
                field="profesor"
                filter="string"
                title="Profesor"
                filterable={false}
              />
              <Column
                field="Pret"
                title="Pret"
                filterable={false}
                cell={paymentMethod}
              />
            </Grid>
            <br />
            <div
              style={{
                fontWeight: "bold",
                fontSize: "20px",
                paddingLeft: "90%",
              }}
            >
              TOTAL{" "}
              {dataFactura?.sedinte?.reduce((total, sedinta) => {
                if (sedinta.starePlata === "neplatit")
                  return total + parseInt(sedinta.Pret);
                else return total;
              }, 0)}
            </div>

            <div style={{ width: "40%" }}>
              CURS EURO 4.8
              <br />
              <div className="row" style={{ paddingLeft: "5%" }}>
                <div class="column" style={{ width: "50%" }}>
                  Emis de Ignat Bogdan CI: RK067080
                </div>
                <div class="column" style={{ width: "50%" }}>
                  Date privind expeditia Numele delegatului: C.I. seria: nr:
                  Mijlocul de transport: Expedierea s-a efectuat la data:
                </div>
              </div>
            </div>
          </Modal.Description>
        </PDFExport>
      </Modal.Content>

      <Modal.Actions>
        <Button color="black" onClick={() => setOpen(false)}>
          CANCEL
        </Button>
        <Button
          content="Descarca"
          labelPosition="right"
          icon="download"
          onClick={() => {
            exportPDFWithComponent();
            setOpen(false);
          }}
          positive
        />
      </Modal.Actions>
    </Modal>
  );
}

export default ModalFactura;
