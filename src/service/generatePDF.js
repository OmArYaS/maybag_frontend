import pdfMake from "pdfmake/build/pdfmake";
import "pdfmake/build/vfs_fonts";
import { toast } from "react-toastify";
import { fetchOrders } from "./queryfn";

// Function to load Arabic font
const loadArabicFont = async () => {
  try {
    // Try first Arabic font
    const response = await fetch(
      "https://fonts.gstatic.com/s/amiri/v16/J7aRnpd8CGxBHpUrtLMA7w.ttf"
    );
    if (!response.ok) {
      throw new Error("First font failed");
    }
    const fontBuffer = await response.arrayBuffer();
    const base64 = btoa(String.fromCharCode(...new Uint8Array(fontBuffer)));

    return {
      normal: `data:font/ttf;base64,${base64}`,
      bold: `data:font/ttf;base64,${base64}`,
      italics: `data:font/ttf;base64,${base64}`,
      bolditalics: `data:font/ttf;base64,${base64}`,
    };
  } catch (error) {
    console.warn(
      "Failed to load first Arabic font, trying alternative:",
      error
    );
    try {
      // Try alternative Arabic font
      const response = await fetch(
        "https://fonts.gstatic.com/s/notonaskharabic/v1/RWmBoL3J3LtZRdbA_ehuqg6hAQJ9NwM.ttf"
      );
      if (!response.ok) {
        throw new Error("Alternative font failed");
      }
      const fontBuffer = await response.arrayBuffer();
      const base64 = btoa(String.fromCharCode(...new Uint8Array(fontBuffer)));

      return {
        normal: `data:font/ttf;base64,${base64}`,
        bold: `data:font/ttf;base64,${base64}`,
        italics: `data:font/ttf;base64,${base64}`,
        bolditalics: `data:font/ttf;base64,${base64}`,
      };
    } catch (secondError) {
      console.warn("Failed to load Arabic fonts:", secondError);
      return null;
    }
  }
};

// Function to detect if text contains Arabic characters
const containsArabic = (text) => {
  if (!text) return false;
  const arabicRegex =
    /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
  return arabicRegex.test(text);
};

// Function to sanitize text for PDF
const sanitizeText = (text) => {
  if (!text) return text;
  return text.toString().replace(/[\u0000-\u001F\u007F-\u009F]/g, "");
};

// Function to handle Arabic text for PDF
const processArabicText = (text) => {
  if (!text) return text;
  return sanitizeText(text); // Keep original text including Arabic characters
};

// Function to create Arabic text style with fallback
const createArabicStyle = (
  useArabicFont,
  fontSize = 9,
  alignment = "right"
) => {
  if (useArabicFont) {
    return {
      font: "Amiri",
      fontSize,
      alignment,
    };
  } else {
    // Fallback: use Roboto with proper text direction
    return {
      font: "Roboto",
      fontSize,
      alignment,
      // Add text direction hint for Arabic
      direction: "rtl",
    };
  }
};

export const generatePDF = async (
  data,
  search,
  statusFilter,
  dateRange,
  token
) => {
  if (!data?.data?.length) {
    toast.error("No orders to export", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
    return;
  }

  try {
    const loadingToast = toast.loading("Generating PDF report...", {
      position: "top-right",
      autoClose: false,
      closeOnClick: false,
      pauseOnHover: false,
      draggable: false,
    });

    // Fetch all pages of data
    const allOrders = [...data.data];
    const totalPages = data.totalPages;

    // Fetch remaining pages if there are more than one
    if (totalPages > 1) {
      for (let page = 2; page <= totalPages; page++) {
        const pageData = await fetchOrders({
          token,
          search,
          sortKey: "orderDate",
          sortOrder: "desc",
          page,
          status: statusFilter,
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
        });
        allOrders.push(...pageData.data);
      }
    }

    // Calculate summary statistics
    const totalAmount = allOrders.reduce(
      (sum, order) => sum + order.totalAmount,
      0
    );
    const statusCounts = allOrders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {});

    // Load Arabic font
    const arabicFont = await loadArabicFont();

    // If Arabic font loading failed, we'll use a different approach
    const useArabicFont = arabicFont !== null;

    // Create PDF document definition
    const docDefinition = {
      pageSize: "A4",
      pageOrientation: "portrait",
      fonts: useArabicFont
        ? {
            Roboto: {
              normal: "Roboto-Regular.ttf",
              bold: "Roboto-Medium.ttf",
              italics: "Roboto-Italic.ttf",
              bolditalics: "Roboto-MediumItalic.ttf",
            },
            Amiri: arabicFont,
          }
        : undefined,
      defaultStyle: {
        font: "Roboto",
        fontSize: 10,
      },
      styles: {
        header: {
          fontSize: 24,
          bold: true,
          color: "#2980b9",
          margin: [0, 0, 0, 10],
        },
        subheader: {
          fontSize: 14,
          bold: true,
          color: "#2980b9",
          margin: [0, 10, 0, 5],
        },
        tableHeader: {
          bold: true,
          fontSize: 10,
          color: "white",
          fillColor: "#2980b9",
        },
        arabicText: {
          font: useArabicFont ? "Amiri" : "Roboto",
          fontSize: 9,
          alignment: "right",
        },
        summaryText: {
          fontSize: 10,
          margin: [0, 2, 0, 2],
        },
      },
      content: [
        // Title
        {
          text: "Orders Report",
          style: "header",
          alignment: "center",
        },

        // Report details
        {
          text: `Generated on: ${new Date().toLocaleDateString()}`,
          style: "summaryText",
          margin: [0, 10, 0, 5],
        },

        // Search and filters
        ...(search
          ? [
              {
                text: `Search: ${processArabicText(search)}`,
                style: containsArabic(search)
                  ? createArabicStyle(useArabicFont, 10)
                  : "summaryText",
              },
            ]
          : []),

        ...(statusFilter
          ? [
              {
                text: `Status: ${processArabicText(statusFilter)}`,
                style: containsArabic(statusFilter)
                  ? createArabicStyle(useArabicFont, 10)
                  : "summaryText",
              },
            ]
          : []),

        ...(dateRange.startDate || dateRange.endDate
          ? [
              {
                text: `Date Range: ${dateRange.startDate || "Start"} to ${
                  dateRange.endDate || "End"
                }`,
                style: "summaryText",
              },
            ]
          : []),

        // Summary section
        {
          text: "Summary",
          style: "subheader",
          margin: [0, 15, 0, 5],
        },

        {
          text: `Total Orders: ${allOrders.length}`,
          style: "summaryText",
        },

        {
          text: `Total Revenue: $${totalAmount.toFixed(2)}`,
          style: "summaryText",
        },

        {
          text: "Status Distribution:",
          style: "summaryText",
          margin: [0, 5, 0, 0],
        },

        ...Object.entries(statusCounts).map(([status, count]) => ({
          text: `${processArabicText(status)}: ${count} orders`,
          style: containsArabic(status)
            ? {
                ...createArabicStyle(useArabicFont, 10),
                margin: [10, 0, 0, 0],
              }
            : "summaryText",
          margin: [10, 0, 0, 0],
        })),

        // Orders table
        {
          text: "Orders Details",
          style: "subheader",
          margin: [0, 20, 0, 10],
        },

        {
          table: {
            headerRows: 1,
            widths: ["auto", "auto", "*", "auto", "*", "auto", "auto", "auto"],
            body: [
              // Header row
              [
                { text: "ID", style: "tableHeader" },
                { text: "User", style: "tableHeader" },
                { text: "Address", style: "tableHeader" },
                { text: "Phone", style: "tableHeader" },
                { text: "Products", style: "tableHeader" },
                { text: "Total", style: "tableHeader" },
                { text: "Status", style: "tableHeader" },
                { text: "Date", style: "tableHeader" },
              ],
              // Data rows
              ...allOrders.map((order) => {
                const productsList = order.products
                  .map(
                    (p) =>
                      `${processArabicText(p.productId.name)} (${
                        p.quantity
                      } × $${p.productId.price})${
                        p.color ? ` - Color: ${processArabicText(p.color)}` : ""
                      }`
                  )
                  .join("\n");

                return [
                  order._id.slice(-6),
                  {
                    text: processArabicText(order.userId?.username) || "N/A",
                    style: containsArabic(order.userId?.username)
                      ? createArabicStyle(useArabicFont, 9, "right")
                      : undefined,
                  },
                  {
                    text: processArabicText(order.userId?.address) || "N/A",
                    style: containsArabic(order.userId?.address)
                      ? createArabicStyle(useArabicFont, 9, "right")
                      : undefined,
                  },
                  {
                    text: processArabicText(order.userId?.phone) || "N/A",
                    style: containsArabic(order.userId?.phone)
                      ? createArabicStyle(useArabicFont, 9, "right")
                      : undefined,
                  },
                  {
                    text: productsList,
                    style: containsArabic(productsList)
                      ? createArabicStyle(useArabicFont, 9, "right")
                      : undefined,
                  },
                  `$${order.totalAmount}`,
                  {
                    text: processArabicText(order.status),
                    style: containsArabic(order.status)
                      ? createArabicStyle(useArabicFont, 9, "right")
                      : undefined,
                  },
                  new Date(order.orderDate).toLocaleDateString(),
                ];
              }),
            ],
          },
          layout: {
            fillColor: function (rowIndex, node, columnIndex) {
              return rowIndex === 0
                ? "#2980b9"
                : rowIndex % 2 === 0
                ? "#f8f9fa"
                : null;
            },
          },
        },
      ],

      // Footer with page numbers
      footer: function (currentPage, pageCount) {
        return {
          text: `Page ${currentPage} of ${pageCount}`,
          alignment: "center",
          fontSize: 8,
          color: "#666",
          margin: [0, 10, 0, 0],
        };
      },
    };

    // Generate and download PDF
    const pdfDoc = pdfMake.createPdf(docDefinition);

    const timestamp = new Date().toISOString().split("T")[0];
    const filename = `orders-report-${timestamp}-${allOrders.length}-orders.pdf`;

    pdfDoc.download(filename);

    // Update loading toast to success
    toast.update(loadingToast, {
      render: "PDF report generated successfully!",
      type: "success",
      isLoading: false,
      autoClose: 3000,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  } catch (error) {
    console.error("PDF Generation Error:", error);
    toast.error(
      "Failed to generate PDF report: " + (error.message || "Unknown error"),
      {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      }
    );
  }
};
