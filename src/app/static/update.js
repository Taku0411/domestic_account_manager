function update(page_index) {
  var button = document.getElementById("update_button");
  var buttonText = button.querySelector("span")
  var buttonIcon = button.querySelector("i");
  button.disabled = true;
  button.classList.remove("hover:shadow-xl", "hover:bg-gray-300");
  button.classList.add("cursor-not-allowed", "shadow-xl", "bg-gray-300");
  buttonIcon.classList.add("fa-spin");
  buttonText.innerText = "更新中";

  var button_mobile = document.getElementById("update_button_mobile");
  button_mobile.disabled = true;
  button_mobile.classList.add("fa-spin", "cursor-not-allowed")

  fetch("/update", {method: "POST"})
    .then(response => response.json())
    .then(data => {
      if (data.status === "success") {
        alert("OK");
      }
      else {
        alert("failed")
      }

      button.disabled = false;
      buttonText.innerText = "更新";
      button.classList.add("hover:shadow-xl", "hover:bg-gray-300");
      button.classList.remove("cursor-not-allowed", "shadow-xl", "bg-gray-300");
      buttonIcon.classList.remove("fa-spin")

      button_mobile.classList.remove("fa-spin")
      button_mobile.disabled = false;
      console.log(page_index)
      if (page_index === 1) {
        draw_index()
      }
      else if (page_index === 2) {
        draw_cash_deposit(false);
      }
      else if (page_index === 3) {
        draw_trust_invest(false);
      }
    })
    .catch(error => {
      alert(`更新失敗．moneyforwardを確認してください: ${error}`);
      button.disabled = false;
      buttonText.innerText = "更新";
      button.classList.add("hover:shadow-xl", "hover:bg-gray-300");
      button.classList.remove("cursor-not-allowed", "shadow-xl", "bg-gray-300");
      buttonIcon.classList.remove("fa-spin")

      button_mobile.classList.remove("fa-spin", "cursor-not-allowed");
      button_mobile.disabled = false;
    })

}
