module.exports =

    displayAddresses: (addresses, full = false) ->
        res = []
        for item in addresses
            if full
                if item.name?
                    res.push "\"#{item.name}\" <#{item.address}>"
                else
                    res.push "<#{item.address}>"
            else
                if item.name?
                    res.push item.name
                else
                    res.push item.address.split('@')[0]
        return res.join ", "