using { cuid, managed } from '@sap/cds/common';

namespace myapp.db;

entity Users : cuid, managed {  
    name  : String(100) @mandatory;
}