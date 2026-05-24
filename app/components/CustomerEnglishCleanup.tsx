"use client";
import { useEffect } from "react";

const replacements: Record<string, string> = {
  "For Booking Please Fill The Details Below.": "Please fill in the details below to book your ride.",
  "Please check details before WhatsApp submit.": "Please review your details before sending on WhatsApp.",
  "Same Day Fair": "Same Day Fare",
  "Book A Cab Atleast 24 Hour Before Travelling Otherwise Booking May Not Be Confirmed": "Book a cab at least 24 hours before travelling; otherwise, booking may not be confirmed.",
  "After the booking is Confirmed , Customer will have to make the Advance Payment": "After the booking is confirmed, the customer must make the advance payment.",
  "Rs.500 Cancellation Charge will have to be paid on Cancellation of Booking under any Circumtances": "A Rs. 500 cancellation charge applies if the booking is cancelled under any circumstances.",
  "Thank You And Wish You A Very Happy Journey": "Thank you. We wish you a very happy journey.",
};

function replaceText(root: ParentNode = document) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = [];
  while (walker.nextNode()) nodes.push(walker.currentNode as Text);
  nodes.forEach((node) => {
    let value = node.nodeValue || "";
    Object.entries(replacements).forEach(([from, to]) => { value = value.replaceAll(from, to); });
    node.nodeValue = value;
  });
}

export default function CustomerEnglishCleanup() {
  useEffect(() => {
    replaceText();
    const observer = new MutationObserver(() => replaceText());
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });

    const proto = CanvasRenderingContext2D.prototype as any;
    const original = proto.fillText;
    proto.fillText = function patchedFillText(text: any, ...args: any[]) {
      let value = String(text);
      Object.entries(replacements).forEach(([from, to]) => { value = value.replaceAll(from, to); });
      return original.call(this, value, ...args);
    };

    return () => { observer.disconnect(); proto.fillText = original; };
  }, []);
  return null;
}
