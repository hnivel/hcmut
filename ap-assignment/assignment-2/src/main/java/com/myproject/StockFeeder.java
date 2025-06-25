package com.myproject;

import java.util.*;

public class StockFeeder {
    private List<Stock> stockList = new ArrayList<>();
    private Map<String, List<StockViewer>> viewers = new HashMap<>();
    private static StockFeeder instance = null;

    private StockFeeder() {
    }

    public static StockFeeder getInstance() {
        if (instance == null) {
            instance = new StockFeeder();
        }
        return instance;
    }

    public void addStock(Stock stock) {
        if (!stockList.contains(stock)) {
            stockList.add(stock);
        }
    }

    public void registerViewer(String code, StockViewer stockViewer) {
        boolean stockExists = stockList.stream()
                .anyMatch(stock -> stock.getCode().equals(code));
        if (!stockExists) {
            Logger.errorRegister(code);
            return;
        }

        List<StockViewer> viewerList = viewers.get(code);
        if (viewerList != null && viewerList.contains(stockViewer)) {
            Logger.errorRegister(code);
            return;
        }

        viewers.computeIfAbsent(code, k -> new ArrayList<>()).add(stockViewer);
    }

    public void unregisterViewer(String code, StockViewer stockViewer) {
        List<StockViewer> viewerList = viewers.get(code);
        if (viewerList != null && viewerList.remove(stockViewer)) {
            if (viewerList.isEmpty()) {
                viewers.remove(code);
            }
        } else {
            Logger.errorUnregister(code);
        }
    }

    public void notify(StockPrice stockPrice) {
        String code = stockPrice.getCode();
        List<StockViewer> viewerList = viewers.get(code);
        if (viewerList != null) {
            for (StockViewer viewer : viewerList) {
                viewer.onUpdate(stockPrice);
            }
        }
    }
}
