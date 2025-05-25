import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "react-toastify";
import { fetchOrders } from "./queryfn";

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

    // Initialize jsPDF with proper configuration
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      putOnlyUsedFonts: true,
      floatPrecision: 16,
    });

    // Set default font
    doc.setFont("helvetica");

    // Add title with styling
    doc.setFontSize(24);
    doc.setTextColor(41, 128, 185); // Blue color
    doc.text("Orders Report", 14, 20);

    // Add date and filters info with styling
    doc.setFontSize(10);
    doc.setTextColor(100); // Gray color
    let yPos = 30;

    // Add report details in a styled box
    doc.setDrawColor(200);
    doc.setFillColor(245, 245, 245);
    doc.roundedRect(14, yPos - 5, 182, 25, 3, 3, "F");

    doc.setTextColor(60);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, yPos);
    yPos += 7;

    if (search) {
      doc.text(`Search: ${search}`, 20, yPos);
      yPos += 7;
    }
    if (statusFilter) {
      doc.text(`Status: ${statusFilter}`, 20, yPos);
      yPos += 7;
    }
    if (dateRange.startDate || dateRange.endDate) {
      doc.text(
        `Date Range: ${dateRange.startDate || "Start"} to ${
          dateRange.endDate || "End"
        }`,
        20,
        yPos
      );
      yPos += 7;
    }

    // Add summary statistics
    const totalAmount = allOrders.reduce(
      (sum, order) => sum + order.totalAmount,
      0
    );
    const statusCounts = allOrders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {});

    yPos += 5;
    doc.setFontSize(12);
    doc.setTextColor(41, 128, 185);
    doc.text("Summary", 14, yPos);
    yPos += 7;

    doc.setFontSize(10);
    doc.setTextColor(60);
    doc.text(`Total Orders: ${allOrders.length}`, 20, yPos);
    yPos += 7;
    doc.text(`Total Revenue: $${totalAmount.toFixed(2)}`, 20, yPos);
    yPos += 7;

    // Add status distribution
    doc.text("Status Distribution:", 20, yPos);
    yPos += 7;
    Object.entries(statusCounts).forEach(([status, count]) => {
      doc.text(`${status}: ${count} orders`, 25, yPos);
      yPos += 7;
    });

    // Add main orders table
    const tableColumn = ["ID", "User", "Products", "Total", "Status", "Date"];

    const tableRows = allOrders.map((order) => {
      const productsList = order.products
        .map(
          (p) => `${p.productId.name} (${p.quantity} × $${p.productId.price})`
        )
        .join("\n");

      return [
        order._id.slice(-6),
        order.userId?.username || "N/A",
        productsList,
        `$${order.totalAmount}`,
        order.status,
        new Date(order.orderDate).toLocaleDateString(),
      ];
    });

    // Use autoTable with enhanced styling
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: yPos + 5,
      theme: "grid",
      styles: {
        font: "helvetica",
        fontSize: 9,
        cellPadding: 2,
        lineColor: [200, 200, 200],
        lineWidth: 0.1,
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontSize: 10,
        fontStyle: "bold",
        halign: "center",
      },
      columnStyles: {
        0: { cellWidth: 15 }, // ID
        1: { cellWidth: 25 }, // User
        2: { cellWidth: 70 }, // Products
        3: { cellWidth: 20 }, // Total
        4: { cellWidth: 25 }, // Status
        5: { cellWidth: 25 }, // Date
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      margin: { top: 10 },
      didDrawPage: function (data) {
        // Add page number
        doc.setFontSize(8);
        doc.setTextColor(100);
        doc.text(
          `Page ${data.pageNumber} of ${data.pageCount}`,
          doc.internal.pageSize.width - 20,
          10
        );
      },
    });

    // Save the PDF with a more descriptive filename
    const timestamp = new Date().toISOString().split("T")[0];
    const filename = `orders-report-${timestamp}-${allOrders.length}-orders.pdf`;
    doc.save(filename);

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
