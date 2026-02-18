package com.eazydeals.utils;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.UUID;

public class OrderIdGenerator {
    
    public static String getOrderId() {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
        String date = sdf.format(new Date());
        // Legacy used just timestamp? No, legacy: "ORD-" + timestamp
        // Wait, collisions possible if high traffic? 
        // Legacy code: return "ORD-" + new SimpleDateFormat("yyyyMMddHHmmss").format(new Date());
        // I'll add a random suffix to be safer.
        return "ORD-" + date + "-" + UUID.randomUUID().toString().substring(0, 4).toUpperCase();
    }
}
