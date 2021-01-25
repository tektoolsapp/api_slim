function generate(selector, param) {

    console.log("GENERATE: ", param);

    $("#quote-notice").removeClass("pdf-container-headings-display").addClass("pdf-container-headings-generate");
    $("#quote-headings").removeClass("pdf-container-headings-display").addClass("pdf-container-headings-generate");
    $("#quote-heading-right").removeClass("header-item-right-display").addClass("header-item-right-generate");
    $("#quote-terms-container").removeClass("quote-terms-container-display").addClass("quote-terms-container-generate");
    $("#quote-totals-container").removeClass("quote-totals-container-display").addClass("quote-totals-container-generate");
    $("div.sub-total-desc-box-display").removeClass("sub-total-desc-box-display").addClass("sub-total-desc-box-generate");
    $("div.sub-total-box-display").removeClass("sub-total-box-display").addClass("sub-total-box-generate");
    $("div.total-box-display").removeClass("total-box-display").addClass("total-box-generate");

    kendo.drawing.drawDOM($(selector), {
            paperSize: "A4",
            repeatHeaders: true,
            keepTogether: ".emp-block",
            scale:.8,
            margin: { left: "1cm", top: "1cm", right: "1cm", bottom: "2.5cm" },
            // REPLACED HEADER AND FOOTER FROM DEMO WITH TEMPLATES:
            template: $("#page-template").html(),
    })
    .then(function (group) {
        // Render the result as a PDF file
        return kendo.drawing.exportPDF(group, {
            landscape: false
        });
    })
    .done(function (data) {

        console.log("DATA: ", data);

        $.ajax({
            url: '/pdf/quote',
            type: "POST",
            data: {
                "req" : param,
                "file" : data
            },
            success: function (response) {

                console.log(response);

                prepareQuote(param);
                alert("PDF successfully generated");
            }
        });
    });
}