<?php

namespace App\Action;

use App\Domain\Utility\Repository\UploadedFileRepository;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Message\UploadedFileInterface;
//use Slim\Psr7\UploadedFile;
use Slim\Psr7\Factory\StreamFactory;

use Intervention\Image\ImageManager;

final class UploadFilesAction
{
    private $storageDirectory = __DIR__ . '/../../public/images';
    private $repository;
    private $imageManager;

    public function __construct(UploadedFileRepository $repository, ImageManager $imageManager)
    {
        $this->repository = $repository;
        $this->imageManager = $imageManager;
    }
    
    public function __invoke(
        ServerRequestInterface $request,
        ResponseInterface $response
    ): ResponseInterface {
        
        $storageDirectory = __DIR__ . '/../../public/images';
        //$uploadedFiles = $request->getUploadedFiles();

        //dump($uploadedFiles);

        // handle single input with single file upload
        //$uploadedFile = $uploadedFiles['filename'];

        //dump($uploadedFile);

        $data = $request->getParsedBody();

        //dump($data);

        $CCCdata = 'data:image/png;base64,iV
        BORw0KGgoAAAANSUhEUgAAAR
        0AAAEOCAIAAAA7SlQZAAAAGX
        RFWHRTb2Z0d2FyZQBBZG9iZS
        BJbWFnZVJlYWR5ccllPAAAAy
        ZpVFh0WE1MOmNvbS5hZG9iZS
        54bXAAAAAAADw/eHBhY2tldC
        BiZWdpbj0i77u/IiBpZD0iVz
        VNME1wQ2VoaUh6cmVTek5UY3
        prYzlkIj8+IDx4OnhtcG1ldG
        EgeG1sbnM6eD0iYWRvYmU6bn
        M6bWV0YS8iIHg6eG1wdGs9Ik
        Fkb2JlIFhNUCBDb3JlIDUuNi
        1jMTQ1IDc5LjE2MzQ5OSwgMj
        AxOC8wOC8xMy0xNjo0MDoyMi
        AgICAgICAgIj4gPHJkZjpSRE
        YgeG1sbnM6cmRmPSJodHRwOi
        8vd3d3LnczLm9yZy8xOTk5Lz
        AyLzIyLXJkZi1zeW50YXgtbn
        MjIj4gPHJkZjpEZXNjcmlwdG
        lvbiByZGY6YWJvdXQ9IiIgeG
        1sbnM6eG1wPSJodHRwOi8vbn
        MuYWRvYmUuY29tL3hhcC8xLj
        AvIiB4bWxuczp4bXBNTT0iaH
        R0cDovL25zLmFkb2JlLmNvbS
        94YXAvMS4wL21tLyIgeG1sbn
        M6c3RSZWY9Imh0dHA6Ly9ucy
        5hZG9iZS5jb20veGFwLzEuMC
        9zVHlwZS9SZXNvdXJjZVJlZi
        MiIHhtcDpDcmVhdG9yVG9vbD
        0iQWRvYmUgUGhvdG9zaG9wIE
        NDIDIwMTkgTWFjaW50b3NoIi
        B4bXBNTTpJbnN0YW5jZUlEPS
        J4bXAuaWlkOkI2QjIyMzdEMj
        kzNzExRUI5NTBFODU2OTI4MU
        E3NkMyIiB4bXBNTTpEb2N1bW
        VudElEPSJ4bXAuZGlkOkI2Qj
        IyMzdFMjkzNzExRUI5NTBFOD
        U2OTI4MUE3NkMyIj4gPHhtcE
        1NOkRlcml2ZWRGcm9tIHN0Um
        VmOmluc3RhbmNlSUQ9InhtcC
        5paWQ6QjZCMjIzN0IyOTM3MT
        FFQjk1MEU4NTY5MjgxQTc2Qz
        IiIHN0UmVmOmRvY3VtZW50SU
        Q9InhtcC5kaWQ6QjZCMjIzN0
        MyOTM3MTFFQjk1MEU4NTY5Mj
        gxQTc2QzIiLz4gPC9yZGY6RG
        VzY3JpcHRpb24+IDwvcmRmOl
        JERj4gPC94OnhtcG1ldGE+ID
        w/eHBhY2tldCBlbmQ9InIiPz
        5eQrZ5AAASpElEQVR42uyde1
        AUd57AdSGRul3AuD7+EEXx3F
        WDBusIUSO+rtbRlc2ZXRV8RK
        2KUQioGzcKvi53m7VQo2Y9RD
        DG3ZRRHopxV0HBq0IliGAwri
        9EkREUq/SkVIYzqxGK+2GnWG
        66p2cY5tn9+ThFDb9uZ4ae/v
        T3+/v179G1paWlCwA4lB9xCA
        DwCgCvAPAKAPAKAK8A8AoA8A
        oArwDwCgDwCgCvAPAKAPAKAK
        8A8AoAFPHlEGiVZ8+eiZ/V1d
        Umk6n8/Pn6Bw969uyZkJDAkc
        ErsFUhIc+DBw8uXb5cX19//N
        gxo9EoyisrK9vvlpKSwrHCK7
        AegrKzs6VNZgoBXoH9IQjwCg
        hBeAWEIMArQhDgFSEI8Er3ND
        c3NzU1iRAknheePEkIAryyMw
        TV3b1748YNQhDgFSEI8IoQBH
        hFCALQuFeEIMCrTtHS0nL79u
        0n331XWFhICAK86rA/Iot78u
        TJo0ePampq8vLyrl+/Lspzc3
        P5ngCvbFKooaFBPLlw4cLDhw
        +/+OILqRyFAK9sbUtobGwkBA
        FeOZKioqJJkyZxoD2B+vp6qe
        +idk5fX18fHx8P/GBdnb2+8M
        mTJ/EKnMSQIUPEz3Hjxv1mxo
        zRo0b5+/t7UGuBUyksLOTrB9
        c4tnjx4r///WmLB4BXoDW7Mr
        Oy3O4V85yBpqisrPzP/2ilub
        mZPBDAwYickHgF4GCKiopE1H
        LXu+MVaDYhzM7OrqiowCsAB6
        u1cuVKt7w144V1hMFgOJKbp6
        W/yGQynSjIX79unTSaQY4oLy
        goEH848QrAVgICAmbMnHXt+o
        3Y2DhLIeurr74iDwSwh+0pKd
        ExMYqbioqKXN/mjlegEZKTN1
        oKWVJvb7wC6DB9g4IshSzyQA
        D7CQsLUyx3fecEvALAKwC8As
        ArAMArALwCwCsAwCsAvALAKw
        DAKwC8AsArAMArALwCwCsAwC
        sAvALAKwDAKwC8AsArALwCAL
        wCwCsAvAIAvALAK9AmZaWly5
        ct6/XTHt1e8pUeQ4f8/KN/X1
        9RcRWvADqMyWRaMP+dcZFj09
        N2iudt5cbq6o3JySNfe01svV
        tXh1cAHZBq2tSpWZmZKvuIrW
        GvjdBh4MIrsJOlCfHnzpXZot
        /4yEi9qYVXYGedSj1Smam15L
        3FeAVghdTUHR3aX0S2EwUFeA
        WgxvFjx8xKDAaD8VbNs+dNR3
        PzxHP5f9m370u8ArCIqCy1b/
        2TSEvf1TcoSDyZbDAcyc2LjY
        2zqiJeAfyDRlOjWUlISIgkVR
        urEhPltSy8ArDImTPFZiWDBw
        82KzHTTEI/97LwClyHf0AAXg
        HYT1lpqbwwAK8ALBEY2N3qPl
        euXDErCQ+PoH4FYJHQ0FCzkq
        qbN81Kvvjzn2Ve/QteAXQAY3
        V1+1/v1tXJuzhFjovEKwCLvD
        FqlHqFavOmTfIdJhum4BWAGi
        EhIWYld+7cbgtWGRn7zbbGxs
        bpp9ECr8BOXo8wb4T4uujrtm
        AlvwU8Z+5cXR0fvAJ7CAsLMy
        v59ttvpWCVnp5mtik8PEIxdc
        QrgP/Hm2+ONSs5d65MSBUXFy
        vf+YMVv9Xb8cErsAfF+LNmze
        qC/HyzQoPBMGPmLLwCsAn5YB
        DFkY5r163X4cHBK7CTf5v+tt
        V9omNi9FazwivoFKPHjFbfwd
        /fPzl5oz4PDl6BnQwb9qr8Ll
        Z7Nm3+RHG0iB7w5fzwzLpKew
        YODAkeEGxp66mTJwvcNHXEzF
        mzNm1Ujkjh4RHvLlqk2y9Up1
        6JC23bUDzFs/bx48d/u3BBPC
        kpKWlsbHTImxZ9Xeykyoa7vI
        qZPduSV7v37NbzhdJTvBK5+J
        gxY2y5Nttxoovac1hYWGjo8M
        DAwKHDhnW0Q43JZLpWUXHmTP
        GhnK/Ky88RXdunguJgyntXJG
        /cKDbhlduSn4Sly4L6Bdn+Ha
        z43YfSiX6iIP/TbX+08Szf++
        W+znxOceqIOCMe4t3v1tVlZ2
        ft/uwzo9GIV9u2blGctaJ///
        46PzLubLeYMHHiZIPBjgubON
        FnzJx15myJyKxcPFpOVMSFXd
        eu39iZli5irJ5PnYqKq6uTkh
        Q3rV+/Hq+8GBFDhF3JG93QmC
        sq5caaWpFh6vbUUZnC1lhdra
        tZOLXmVVty6Ba1RNgUGaYIXP
        rMANUnZ9+xIwWvtKCWfCJIlw
        Wu/RkZujppykpLLWWAbRTk5y
        tOHYNXXsbHGza4q8IjKnv6Uc
        tkMi1cuMCWPTds+INuvfL12C
        /v2rVrXV6MQg0MEP8Chw4dqt
        4+Lram79o1d86cDr3RzaqqjI
        z9z58/v3LlSnNT00svv9ynd5
        9evXsN/ufBE/91Ut++Qbardf
        v2batXcWvJ1da25w0Njy+8uI
        FmlaqqKld+NVs+2Ww2m0WXF/
        cDX4+IyM7KkocsffYP9FCvev
        20h7wwZvbsxKQklfZDO2ZQOH
        Lkrxv+YPGyOnzEiEWL3pv3zr
        yf/MR6JBS5aCdvcK1OSvT8DF
        DxRvChw4fFxc/MKylkHTmaSx
        7o0WRlZo6PjFTJ2kXIcmwD3e
        VLl5YvW9qnV6/Pdu2yKeB8uk
        3bGWDUtF/Ky6W7wH2DguRVXB
        GyWAfVa75alRn033rrLYe/aV
        NT09KE+IUL5j99+lR9T5HzaL
        jlXRwE+ZEPD4+QbtYLligNFl
        acmwmvPFGtgwcOWNrar5+z7v
        RnZmR8uGKF1d3i4xM0eaLkHD
        ygOGyxfT9AEbXkHYjT09N0GL
        K8sj3wr385bGmTf4ATmwR37/
        4sOyvTashSHz3hjbROXBGrEI
        t2pqWbVXcVRwfrMGRpbfyVs7
        t7rlq58vvvn6nvM3OW1qZziI
        mOlmeAIjTJR4KIywohS4NeOX
        vd9Xv37v3l8GH1faZNi9LSIV
        XsWuHv75+WrtyWQ8jyVq8GDr
        SYaMmXEnQ4ez7/3GoqqJnzw1
        LXiozMLEtjgQlZ3uqVygz6DQ
        0Nzn73U6dOfffkifo+2qhiWW
        pYj42Nm6w6wJmQ5X1eiVNWZT
        664uKvXfAZyr/5Rn0H+bqg3o
        hiw7o4/h9v2GA1Yus8ZHmZVy
        KtP6RavTlZeNIFH6Py+nX1Hc
        JGjrTjZZ89b+roQ31ijE6mu4
        oN6+L42zLgWuchy5u8EufQxU
        uXVVr8FJddcgb19Q/Ud+jevb
        tXnxYVFVffV7rJa/sAe52HLA
        /tH5iYlPS3dr1OJ0ycOGXqVK
        vfqMsuhw8e1Gv4nBC5329+/W
        vF61pb1wpbECFLPqGN+I62p6
        TglXv4/ccdHmKguJKFk3hmrU
        OTt1er5D3WRQa+LyOzQ68jhS
        wztcR3tCoxUfPzCmrk/pW4xM
        ZER7vs7QICNbtEmqVqVUZmlh
        0Lw+m2lqURr9avW+eampVEjx
        491HeoranVUrVKpOWT7Wog0W
        0ty+u9EpHqrV9FpaftdOWbvv
        KKFa9u3TJ645FUrFaFh0fYkZ
        brPGR5t1dlpaWDBg6Qr7nkbH
        7+s5+p7/Do0WPNVKsOHDzQmZ
        fVZ8jy1nmkc3IObv/0j67M/d
        ro2rXrKGtLadj3waRx+N27d3
        81NNTG/+IogVWqVZ1vY9Bhw6
        A3eSWy/9KzpadPnzqWl6cytN
        HZTJgw4eWXu6l/Tvte2V3j8E
        XYd2y1SjFk6aph0EO96vZS6w
        cLCAgYMmSoW4KSCnPmzlPf4W
        zJWe+qVil2AhQmdKZapfOQ9S
        MP/8o9TarAwMBZ1hr0RUT1oj
        Ng2tSp8uBvx90qalnaabdwPS
        J18fPzU78WyKcl8liWL1umeO
        XKO3bcjrtVVkOWvFCrDYN41Q
        FGjAhbumy5+j4qc294GjkHDy
        jen0jeuNEZQ8h0FbLwyuaaqK
        9vzqGcbt26qe+2ZcsnXvHnVF
        RcVZyyIjompkOdAAlZeGU/IY
        MGlX3zTfCAAVYjgPwWkGdWXM
        dHRipOWrYj1Yl32PUTsvDKCl
        27dv3tBx+cP/9taOhwqyert6
        z7ZKmtYvee3Q6vVtkSsuKUWv
        nxSpv4+fktWRJ7s9q4afMn//
        TjH1vdX3Hici9qq0jftcsFi5
        cqhiztLT7iq3N5IiLemD9/wf
        3791qvMT4+vXq2/gsK6jdq9O
        iwsDAfHx/b2wA2uWMNLke1VS
        QmJanMbuDwkCW/l6Wxmdz17t
        XYyEjx6HwbQEfXMXELVTdvKn
        7O6JgYB94CtjFkmamlscVHyA
        M7izgbxnfaTNegmKY6u63C9l
        qWltbL8kWMzvCnPXviYpd47+
        eXt1WI2NvY+L+mhobLly+LX2
        tra9vGvDx6+Mj27i+GKT+smT
        RwYEhwcLB4Mnz48LZ1zERcio
        2NMxvfraWQhVd2creubs2a1Y
        p9wL2IMW++mX88PykxUTqtHf
        jK6q8mrBOWKoYsbdSy8Moeo7
        Kzsz1/DTgbz37Xj15TsU4zIc
        udXtXW3i4ra80rgvr29YrxAv
        994kRubq6LxybrjYULF0yebI
        iKivrF5Ml4ZQ/iBHXNOZqTc7
        Bfv/5WVyhWbpYoK7t65YrbB3
        3pB2N1tXRiiC9rztx5XiqYLv
        LAubNntz0PGTSobZLnCRMmKu
        5/6lTrpLlnS0oQyY2Ig98m2O
        o1a6Ojo71oEKTu6lfictjW3O
        ziqsW4yLFmdXePPUptXSLCRo
        6U5u7t37+/fC1M/wB/qYuGcO
        BaRYXZ1jNnin9I+GtaGxVLSk
        oaGxvtE0zUZsUjZvbs99+P94
        raF+0W7mwz8AR/ur/ySlhYWG
        Bg99AXk2rYd9ZKTedmhYov1d
        qOb2oUygnZysvPl5efs/1dsj
        IzxUNcj9auXefhduGVjvD393
        8/Pj44eIBQKCgoyC1plRTf2l
        tRVlqamrrD9sGgUhumh9uFVz
        pizJgxruyvZCPCDSF5RwdZS3
        aJzDBlR6qz++DbAf2YwP2IyJ
        motCqkLZnhoIEDTsh68eIVQC
        sfrlwl0lR5tW1/RkZ0TIx6q8
        avoqYtmP+ORzXe4hV4BEKhNW
        vXyp05evTo3i/3GW/VxMbGWQ
        1cnjMtPl6Bp7DovcXydZmFMG
        WlpSJR3J6Som5X6/0uVy3UhF
        fgTSFr+38pTNMZNe2XUo4n2X
        Xh4kXnrf6KV6BBJhsMcmeEVP
        Pm/mM45rBhrx7JzTuamyevj+
        EVgDIbN2+WFxbk5y9ftszMQG
        NNrccGLrwCz0KEo51p6fLy9L
        SdZmqJvHFfRqZnRi28Ao/j3U
        WLFNvWJbXat6crtiLiFYAyO1
        J3ytsGJbXeiHi9/aRo0dExHv
        j56ccEnogIRIcOHx43dqy8C7
        yxunpc5FjDlCnTp79t+wJ8eA
        XwQ0WrqLhYUa0u7ptBgDwQNK
        KWJ7en4xV4q1oXL10OD4/AKw
        BH0jco6HhBfrI3TNONV+BNBA
        QErPjdh8ZbNep92/EKwJ7AJf
        Vt35mWLgRrq3eJJwaDQRTaN4
        jLGdAeCN5n17uLFomHfNO2rV
        uIVwCaBa8A8AoArwDwCgDwCg
        CvAPAKAPAKAK8A8AoA8AoArw
        DwCgDwCgCvAPAKANzkVUtLC0
        cZ8MrBPHz4kKMMeIVXAB7v1f
        PnzznKgFfUrwA83isAvAIAvA
        LAKwC8AgC8AsArALwCALwCwC
        sAvAIAvALAKwC8AgC8AsArgA
        5RW1OrWB4eHo5XAHaSkbFfsT
        wgIACvAOxhz+efm0wmefmQIU
        N69uyJVwAdpqLialLiKktbe/
        fujVcAHeNPe/aMj4xUDFaCjz
        76yPUfyZdvRT9U3by5betWLf
        1FtbW1Gfv3WTJKSgKnT38br8
        CJGKurVycl6upPjo+P9/Pr5v
        r3JQ8EzWIwGOLi4tzy1ngF2k
        RkgHv37vXx8cErAIdJdfr0ad
        c3A+IVaDn9Kysrc6NUeAVaC1
        MpKSl5eXmu72BhBu2BoAWdur
        y4TzV9+ttuaf3DK70nSFFRUV
        r6iyZNmiR+BgUFuT1AucEr6X
        JSWVnJme1ehFQJCQkcBy14lf
        CCp0+fiedGY7XJZCovL7948W
        JxcTGyAV51CinrHTZsmPg5at
        QoqbC5ufn586b79+89efKksL
        Dw/v3/yck5KG3CN8ArO/F5QX
        BwcJtyH3/8e/FTBDeTqaG+vv
        7SpUviZ25ubm1tLbIBXnU2uP
        n59RZIsklVAiHb998/q6urI5
        MEvHKsbN0UM0lRbRPPySQBrx
        yZSUqyqWSSqampyAZ45dxM8s
        6dO1VVVVTbwHl01fl69W2ZpF
        Rt03YmmZKSwv0rvHInIrhJNw
        C0lEniFXmg+zPJ9jcAyCSBeO
        XqyNZFqSuJB/pGvCJeeVNk6y
        LrStI+kywsLBS/0iaJV+DETJ
        KuJHgFjpeNriR4BS6TrRudkv
        EKnI6NnZKptuEVOD2TlG4AkE
        m6HdrZNYu8U3KfPr1pZ8crAG
        +Fec4A8AoArwDwCgDwCgCvAP
        AKAPAKAK8A8AoA8AoArwDwCg
        DwCgCvAPAKAPAKAK8A8AoA8A
        oArwDwCgCvAACvAPAKAK8AAK
        8A8ApAL/yfAAMASYT/a5ncIL
        0AAAAASUVORK5CYII=';

        $dataArray = explode(",",$data);
        $dataStr = $dataArray[1];

        $fileName = $storageDirectory.'/testing.png';
        
        $this->imageManager->make(base64_decode($dataStr))->save($fileName); 

        $tradesData = array();

        $response->getBody()->write((string)json_encode($tradesData));

        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(201);


        //Image::make($data)->save($fileName);   
        
       /*  if ($uploadedFile->getError() === UPLOAD_ERR_OK) {
            $filename = $this->moveUploadedFile($storageDirectory, $uploadedFile);
            $response->getBody()->write('Uploaded: ' . $filename . '<br/>');
        
            //SAVE THE FILE

            $insertUploaed = $this->repository->insertUploadedFile($filename);
            //dump($insertUploaed);
        
        }

        return $response->withStatus(422); */
    }

    function moveUploadedFile(string $storageDirectory, UploadedFileInterface $uploadedFile)
    {
        $extension = pathinfo($uploadedFile->getClientFilename(), PATHINFO_EXTENSION);

        // see http://php.net/manual/en/function.random-bytes.php
        $basename = bin2hex(random_bytes(8));
        $filename = sprintf('%s.%0.8s', $basename, $extension);

        $uploadedFile->moveTo($storageDirectory . DIRECTORY_SEPARATOR . $filename);

        return $filename;
    }

}