import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import classNames from "classnames/bind";

import * as productService from "../../service/productService";

import styles from "./Cart.module.scss";
import CardStore from "../../components/CardStore/CardStore";
import Slick from "../../components/Slick/Slick";
import Button from "../../components/Button/Button";
import config from "../../config";
import EmptyProduct from "../../components/EmptyProduct/EmptyProduct";
import Loading from "../../components/Loading/Loading";

import { selectCart } from "../../redux/selector";
import { codeDiscount } from "../../data/cart";
import { deleteAllCart, addTotalBill } from "../../redux/slice/productSlice";

const cx = classNames.bind(styles);
function Cart() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const refItem = useRef();
    const cartList = useSelector(selectCart);
    const [code, setCode] = useState("");
    const [productRecoment, setProductRecomment] = useState([]);
    const [loading, setLoading] = useState({
        productLoading: false,
    });
    const [totalProduct, setTotalProduct] = useState({
        totalBill: 0,
        totalDiscount: 0,
        totalPay: 0,
    });
    const { totalBill, totalPay, totalDiscount } = totalProduct;

    //Handle code discount
    const handleCheckCodeDiscount = () => {
        codeDiscount.map((codeDiscount, index) => {
            if (code === codeDiscount) {
                const discount = (totalBill / 100) * ((index + 1) * 10);
                const total = totalBill - discount;
                setTotalProduct((pre) => ({
                    ...pre,
                    totalDiscount: discount,
                    totalPay: total,
                }));
            }
        });
    };

    //Handle pay
    const onPayClick = () => {
        dispatch(addTotalBill(totalProduct));
        navigate(config.routes.order);
    };

    const getRecommentProduct = async () => {
        try {
            const res = await productService.getOldProduct({
                limit: 8,
                sortBy: "product_name",
                orderBy: "DESC",
            });
            setProductRecomment(res.data);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading({ productLoading: false });
        }
    };

    useEffect(() => {
        const price = cartList.reduce(
            (totalPay, curProduct) =>
                totalPay + curProduct.product_price * curProduct.quantity,
            0
        );

        setTotalProduct((pre) => ({
            ...pre,
            totalBill: price,
            totalPay: price,
        }));
    }, [cartList]);

    useEffect(() => {
        setLoading({ productLoading: true });
        getRecommentProduct();
    }, []);

    return (
        <div className={cx("container-fluid gx-0", "wrapper")}>
            {cartList.length > 0 ? (
                <div className={cx("row gx-0", "content")}>
                    <div
                        className={cx(
                            "col-12 col-xxl-8 col-xl-8 col-lg-8",
                            "left-content"
                        )}
                    >
                        <div className={cx("cart-title")}>
                            B???n c?? c???n th??m ?
                        </div>
                        {!loading.productLoading ? (
                            <Slick itemShow={1} className={cx("cart-slick")}>
                                {productRecoment.map((item) => (
                                    <div
                                        ref={refItem}
                                        key={item?.id}
                                        className={cx(
                                            "col-12 col-xxl-6 col-xl-6 col-lg-6 col-md-6",
                                            "slick-item"
                                        )}
                                    >
                                        <CardStore
                                            data={item}
                                            limit
                                            typeCart
                                        ></CardStore>
                                    </div>
                                ))}
                            </Slick>
                        ) : (
                            <div className={cx("slick-loading")}>
                                <Loading></Loading>
                            </div>
                        )}
                        <div className={cx("cart-title-1")}>Gi??? h??ng</div>
                        {cartList.map((item, index) => (
                            <div key={index}>
                                <CardStore data={item} typeCart></CardStore>
                                <div
                                    className={cx(
                                        index === cartList.length - 1
                                            ? "black-line"
                                            : "line"
                                    )}
                                />
                            </div>
                        ))}
                        <div className={cx("left-bottom-btn")}>
                            <div className={cx("bottom-item")}>
                                <Button
                                    className={cx("bottom-btn")}
                                    onClick={() => dispatch(deleteAllCart())}
                                >
                                    Xo?? h???t
                                </Button>
                            </div>
                            <div className={cx("bottom-item")}>
                                <Button
                                    className={cx("bottom-btn")}
                                    onClick={() =>
                                        navigate(config.routes.product)
                                    }
                                >
                                    Quay l???i mua h??ng
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div
                        className={cx(
                            "col-12 col-xxl-4 col-xl-4 col-lg-4",
                            "right-content"
                        )}
                    >
                        <div className={cx("list-group")}>
                            <div className={cx("cart-title", "right-title")}>
                                ????n h??ng
                            </div>
                            <div className={cx("group-item", "code-item")}>
                                <h3>Nh???p m?? khuy???n m??i</h3>
                                <div className={cx("group-flex", "form-group")}>
                                    <input
                                        onChange={(e) =>
                                            setCode(e.target.value)
                                        }
                                        className={cx(
                                            "form-control",
                                            "code-input"
                                        )}
                                        type="text"
                                        value={code}
                                    />
                                    <Button
                                        className={cx("btn-apply")}
                                        onClick={handleCheckCodeDiscount}
                                    >
                                        ??p d???ng
                                    </Button>
                                </div>
                            </div>
                            <div className={cx("group-item", "line")}></div>
                            <div className={cx("group-item", "price-item")}>
                                <div className={cx("group-flex")}>
                                    <h3>????n h??ng</h3>
                                    <h3>
                                        {totalBill.toLocaleString("it-IT", {
                                            style: "currency",
                                            currency: "VND",
                                        })}
                                    </h3>
                                </div>
                                <div className={cx("group-flex")}>
                                    <h3>Gi???m</h3>
                                    <h3 className={cx("title-discount")}>
                                        {totalDiscount.toLocaleString("it-IT", {
                                            style: "currency",
                                            currency: "VND",
                                        })}
                                    </h3>
                                </div>
                            </div>
                            <div className={cx("group-item", "line")}></div>
                            <div className={cx("group-item", "total-item")}>
                                <div
                                    className={cx("group-flex", "total-price")}
                                >
                                    <h3>T???m t??nh</h3>
                                    <h3>
                                        {totalPay.toLocaleString("it-IT", {
                                            style: "currency",
                                            currency: "VND",
                                        })}
                                    </h3>
                                </div>
                                <Button
                                    className={cx("btn-order")}
                                    onClick={onPayClick}
                                >
                                    Ti???p t???c thanh to??n
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <EmptyProduct
                    headerTitle="Gi??? h??ng c???a b???n"
                    title="B???n ??ang kh??ng c?? s???n ph???m n??o trong gi??? h??ng !"
                />
            )}
        </div>
    );
}

export default Cart;
