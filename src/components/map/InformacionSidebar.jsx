
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { tokens } from "../../theme";
import { useTheme, Button } from "@mui/material"

const InformacionSidebar = () => {

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const features = useSelector((state) => state.features);
    const feat = features.features_layer;

    let data_json = null;
    if (Object.keys(feat).length > 0) {
        if (feat.hasOwnProperty('data_json')) {
            const object = JSON.parse(feat.data_json);
            data_json = Object.fromEntries(
                Object.entries(object).filter(([key, value]) => value !== null && value !== '' && !key.includes('id') && !key.includes('latitud') && !key.includes('longitud'))
            );
        }
    }



    return (
        <div className="w-[90%]">
            <div className="h-8 flex items-center px-3"
                style={{ backgroundColor: theme.palette.mode === "dark" ? colors.primary[600] : colors.grey[700], color: theme.palette.mode === "dark" ? colors.grey[100] : 'white' }}
            >
                <h1 className="text-base">Información</h1>
            </div>
            <div key={1}
                style={{ backgroundColor: theme.palette.mode === 'dark' ? colors.primary[500] : colors.primary[400] }}
            >


                {data_json && Object.keys(data_json).length > 0 && Object.keys(data_json).sort().map((item, index) => (
                    <Button key={index}
                        sx={{ width: '100%', backgroundColor: theme.palette.mode === 'dark' ? colors.primary[500] : colors.primary[400], color: colors.grey[100] }}
                    >
                        {`${item.replaceAll('_', ' ')} : ${data_json[item]}`}
                    </Button>
                ))}

                {Object.keys(feat).length > 0 && (feat.cuenta || feat.municipio || feat.ide || feat.id) && !feat.data_json ? Object.keys(feat).map((f, index) => (
                    <>
                        {f !== 'fecha_filter' && f !== 'latitud' && f !== 'longitud' && f !== 'ide' && (
                            <Button key={index} sx={{ width: '100%', backgroundColor: theme.palette.mode === 'dark' ? colors.primary[500] : colors.primary[400], color: colors.grey[100] }}>
                                {`${f.replaceAll('_', ' ')} : ${feat[f]}`}
                            </Button>
                        )}
                    </>
                )) : null}


            </div>
        </div>
    )
}

export default InformacionSidebar