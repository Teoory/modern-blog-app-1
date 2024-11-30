import React, { useState, useContext } from "react";
import { UserContext } from '../../Hooks/UserContext';
import { Navigate } from "react-router-dom";
import { API_BASE_URL } from "../../config";

const PurchasePage = () => {
  const {userInfo, setUserInfo} = useContext(UserContext);
  const [redirect, setRedirect] = useState(false);
  const [price] = useState("30");
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolderName, setCardHolderName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvc, setCvc] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");


  const handlePayment = async () => {
    if (!price || isNaN(price) || price <= 0) {
      setMessage("Lütfen geçerli bir tutar girin.");
      return;
    }
    if (!cardNumber || !cardHolderName || !expiryDate || !cvc) {
      setMessage("Lütfen tüm kart bilgilerini eksiksiz girin.");
      return;
    }
  
    setLoading(true);
    setMessage("");
  
    try {
      // Boşlukları kaldır
      const formattedCardNumber = cardNumber.replace(/\s+/g, '');
  
      const response = await fetch(`${API_BASE_URL}/payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userInfo?.id,
          price,
          paymentCard: {
            cardNumber: formattedCardNumber,
            cardHolderName,
            expireMonth: expiryDate.split("/")[0],
            expireYear: `20${expiryDate.split("/")[1]}`,
            cvc,
          },
        }),
      });
  
      const result = await response.json();
  
      if (result.message === "Ödeme başarılı, Premium aktif edildi") {
        setMessage("Ödeme başarılı! Premium üyelik aktif edildi.");
        logoutUser();
        setRedirect(true);
      } else {
        setMessage("Ödeme işlemi sırasında bir hata oluştu.");
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Bir hata oluştu. Lütfen tekrar deneyin."
      );
    } finally {
      setLoading(false);
    }
  };  


  const logoutUser = async () => {
    await fetch(`${API_BASE_URL}/logout`, {
        credentials: 'include',
        method: 'POST',
    });
    setUserInfo(null);

    document.cookie.split(';').forEach(cookie => {
        const eqPos = cookie.indexOf('=');
        const name = eqPos > -1 ? cookie.substring(0, eqPos) : cookie;
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
    });
    localStorage.clear();
  };

  if (redirect) {
    return <Navigate to="/home" />;
  }

  return (
    <div style={styles.container}>
      <h2 style={{color:'var(--color-black)'}}>Ödeme Sayfası</h2>
      <div style={styles.userInfo}>
        <span style={styles.infoTexts}>
          <strong style={styles.strong}>E-posta:</strong> {userInfo?.email || "Bilinmiyor"}
        </span>
        <span style={styles.infoTexts}>
          <strong style={styles.strong}>Kullanıcı Adı:</strong> {userInfo?.username || "Bilinmiyor"}
        </span>
        <span style={styles.infoTexts}>
          <strong style={styles.strong}>id:</strong> {userInfo?.id || "Bilinmiyor"}
        </span>
        <span style={styles.infoTexts}>
          <strong style={styles.strong}>Rol:</strong> {userInfo?.tags[0] || "Bilinmiyor"}
        </span>
      </div>

      <div style={styles.paymentForm}>
        <label>
          <strong>Premium Üyelik Fiyatı Aylık:</strong>
        </label>
        <input
          type="text"
          value={price + " TL"}
          readOnly
          style={styles.input}
        />

        <label>
          <strong>Kart Numarası:</strong>
        </label>
        <input
          type="text"
          value={cardNumber}
          onChange={(e) => {
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/(.{4})/g, '$1 ').trim();
            setCardNumber(value);
          }}
          placeholder="XXXX XXXX XXXX XXXX"
          maxLength={19}
          style={styles.input}
        />

        <label>
          <strong>Kart Sahibinin Adı:</strong>
        </label>
        <input
          type="text"
          value={cardHolderName}
          onChange={(e) => {
            const value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
            setCardHolderName(value);
          }}
          placeholder="Kart sahibinin adını girin"
          style={styles.input}
        />

        <label>
          <strong>Son Kullanma Tarihi (MM/YY):</strong>
        </label>
        <input
          type="text"
          value={expiryDate}
          onChange={(e) => {
            let value = e.target.value.replace(/[^0-9]/g, '');
            if (value.length > 2) {
              value = `${value.slice(0, 2)}/${value.slice(2, 4)}`;
            }
            if (value.length > 5) value = value.slice(0, 5);
            setExpiryDate(value);
          }}
          placeholder="Örn: 12/25"
          maxLength={5}
          style={styles.input}
        />

        <label>
          <strong>CVC:</strong>
        </label>
        <input
          type="text"
          value={cvc}
          onChange={(e) => {
            const value = e.target.value.replace(/[^0-9]/g, '');
            setCvc(value.slice(0, 3));
          }}
          placeholder="Kartın arkasındaki 3 haneli CVC"
          maxLength={3}
          style={styles.input}
        />

        <button onClick={handlePayment} style={styles.button} disabled={loading}>
          {loading ? "Ödeme İşleniyor..." : "Ödemeyi Tamamla"}
        </button>
      </div>

      {message && <p style={styles.message}>{message}</p>}
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    maxWidth: "600px",
    margin: "0 auto",
    textAlign: "center",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f5f5f5",
    borderRadius: "8px",
    color:'var(--color-black)'
  },
  userInfo: {
    marginBottom: "20px",
    backgroundColor: "#f9f9f9",
    padding: "10px",
    borderRadius: "8px",
    textAlign: "left",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  infoTexts: {
    fontSize: "16px",
    textAlign: "left",
    color:'var(--color-info)'
  },
  strong: {
    fontWeight: "bold",
    color: "var(--color-black)",
  },
  paymentForm: {
    marginTop: "20px",
  },
  input: {
    display: "block",
    margin: "10px auto",
    padding: "8px",
    width: "100%",
    maxWidth: "300px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  message: {
    marginTop: "20px",
    color: "green",
  },
};

export default PurchasePage;