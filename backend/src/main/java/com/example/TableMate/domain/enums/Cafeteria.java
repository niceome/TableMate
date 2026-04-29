package com.example.TableMate.domain.enums;

public enum Cafeteria {
    CHEONJI("천지관"),
    BAENGNO("백록관"),
    KNUTERIA("크누테리아");

    private final String displayName;

    Cafeteria(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
